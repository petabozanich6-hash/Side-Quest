import type {Env} from "./types";
import {unifiedPortalPilot} from "./unifiedPortalIdentity";
import {approvedClubCertificate} from "./clubCertificateDelivery";
import {loadSignedTemplate,buildSignedClubCertificate} from "./clubSignedCertificate";
import {sendEmail,layout,p,esc} from "./email";
const norm=(v:unknown)=>String(v??"").trim().toLowerCase();
export function clubCertificateEmailEnabled(e:Env){
 return unifiedPortalPilot(e)&&e.SUPPORT_CLUB_CERTIFICATE_EMAIL_TEST==="true"&&!!e.EMAIL&&!!e.BUCKET&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(norm(e.SUPPORT_UNIFIED_TEST_EMAIL));
}
async function currentRecipient(e:Env,row:any){
 const r=await e.DB.prepare(`SELECT u.email FROM users u JOIN support_portal_enquiries p ON p.parent_user_id=u.id AND p.family_id=u.family_id
 JOIN support_guest_requests r ON r.id=p.request_id AND r.email=u.email
 WHERE u.id=? AND u.family_id=? AND p.request_id=? AND p.learner_id=? AND p.service='english-club' AND u.email_verified_at IS NOT NULL AND u.email_verified_at<>''
 AND NOT EXISTS(SELECT 1 FROM family_admin_state a WHERE a.family_id=u.family_id AND a.status<>'active')`).bind(row.parent_user_id,row.family_id,row.request_id,row.learner_id).first<{email:string}>();
 return r&&norm(r.email)===norm(e.SUPPORT_UNIFIED_TEST_EMAIL)?r.email:null;
}
function same(a:any,b:any){return !!a&&!!b&&["id","template_id","learner_name","title","session_count","completed_at","delivery","family_id","parent_user_id","learner_id","request_id"].every(k=>a[k]===b[k]);}
export async function processClubCertificateEmails(e:Env,now=new Date(),sender:typeof sendEmail=sendEmail){
 if(!clubCertificateEmailEnabled(e)||!await e.DB.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='support_club_certificate_email'").first())return {sent:0,review:0,suppressed:0};
 const rows=(await e.DB.prepare(`SELECT x.id FROM support_club_certificates x
 JOIN support_club_certificate_candidates c ON c.kind=x.kind AND c.booking_id=x.booking_id AND c.request_id=x.request_id AND c.family_id=x.family_id AND c.parent_user_id=x.parent_user_id AND c.learner_id=x.learner_id AND c.learner_label=x.learner_name AND c.title=x.title AND c.expected_count=x.session_count AND c.certificate_delivery=x.delivery AND c.last_end_at=x.completed_at
 WHERE x.status='approved' AND x.template_id IS NOT NULL AND x.delivery IN ('pdf','both')
 AND c.seat_count=c.expected_count AND c.completed_count=c.expected_count AND julianday(c.last_end_at)<=julianday(?)
 AND lower(trim(c.email))=? AND NOT EXISTS(SELECT 1 FROM support_club_certificate_email d WHERE d.certificate_id=x.id)
 ORDER BY x.approved_at,x.id LIMIT 3`).bind(now.toISOString(),norm(e.SUPPORT_UNIFIED_TEST_EMAIL)).all<{id:string}>()).results||[];
 let sent=0,review=0,suppressed=0;
 for(const candidate of rows){
  const row=await approvedClubCertificate(e,candidate.id,now);
  if(!row||!row.template_id||!["pdf","both"].includes(row.delivery))continue;
  const recipient=await currentRecipient(e,row);if(!recipient)continue;
  const stamp=now.toISOString();
  // Claim before rendering or sending: an uncertain outcome is never automatically retried.
  const claim=await e.DB.prepare(`INSERT OR IGNORE INTO support_club_certificate_email(certificate_id,template_id,status,attempted_at)
 SELECT id,template_id,'sending',? FROM support_club_certificates WHERE id=? AND status='approved' AND template_id=? AND delivery IN ('pdf','both')`).bind(stamp,row.id,row.template_id).run();
  if(!claim.meta?.changes)continue;
  let status="review";
  try{
   const art=await loadSignedTemplate(e,row.template_id);
   if(art){
    const doc=buildSignedClubCertificate(row,art);
    const current=await approvedClubCertificate(e,row.id,now);
    if(!same(row,current)||await currentRecipient(e,row)!==recipient||!clubCertificateEmailEnabled(e))status="suppressed";
    else{
     const subject="Quest complete! Your English Club certificate";
     const lines=["Hooray, explorer!","Congratulations on completing your English Club adventure. Ignis and I are cheering you on! Your personalised, signed certificate is attached, ready to print or keep as a special reminder of your achievement.","Keep exploring, keep creating, and keep asking those wonderfully curious questions.","Happy questing,\nPeta"];
     const ok=await sender(e,{to:recipient,subject:"[Sandbox test] "+subject,text:"Private sandbox test — no real delivery requested.\n\n"+lines.join("\n\n"),html:layout({preheader:"Your signed certificate is ready.",kicker:"English Club",heading:subject,body:p("Private sandbox test — no real delivery requested.")+lines.map(v=>p(esc(v))).join(""),reason:"Private test of the selected free digital certificate delivery."}),attachments:[{filename:doc.filename,type:"application/pdf",content:doc.pdf,disposition:"attachment"}]});
     status=ok?"sent":"review";
    }
   }
  }catch{/* delivery or storage uncertain; retain review state */}
  await e.DB.prepare("UPDATE support_club_certificate_email SET status=?,sent_at=? WHERE certificate_id=? AND template_id=? AND status='sending' AND attempted_at=?").bind(status,status==="sent"?stamp:null,row.id,row.template_id,stamp).run();
  if(status==="sent")sent++;else if(status==="suppressed")suppressed++;else review++;
 }
 return {sent,review,suppressed};
}
