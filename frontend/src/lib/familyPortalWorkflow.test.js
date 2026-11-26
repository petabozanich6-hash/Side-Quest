import {nextBookingAction,orderStatus,payableOrder,canJoinFamilySession} from "./familyPortalWorkflow";
const enquiry={status:"reviewing"};
const quote={id:"q",status:"offered"};
const interested={...quote,status:"interested"};
const order={id:"o",quote_id:"q",status:"awaiting_confirmation"};
test("each completed step directs the family toward the next eligible action",()=>{
 expect(nextBookingAction(enquiry,[quote],[])).toEqual({stage:"proposal",quote:"q",label:"Review your proposal"});
 expect(nextBookingAction(enquiry,[interested],[]).stage).toBe("times");
 expect(nextBookingAction(enquiry,[interested],[order]).stage).toBe("arrangement");
 expect(nextBookingAction(enquiry,[interested],[{...order,status:"confirmed"}]).stage).toBe("payment");
 expect(nextBookingAction(enquiry,[interested],[{...order,status:"paid"}]).stage).toBe("bookings");
});
test("package agreement and payment point to root or actual instalment, never duplicate full package payment",()=>{
 const root={...order,package_sequence:1,package_total:4};
 const child={...order,id:"child",package_sequence:2,package_root_id:"o",package_total:4};
 expect(nextBookingAction(enquiry,[interested],[child,root]).order).toBe("o");
 expect(payableOrder(child)).toBe(false);
 expect(payableOrder({...child,installment:true})).toBe(true);
 expect(nextBookingAction(enquiry,[interested],[{...child,status:"confirmed"},{...root,status:"confirmed"}]).order).toBe("o");
});
test("closed requests, review and cancellation never advertise a payable confirmed booking",()=>{
 expect(nextBookingAction({status:"closed"},[quote],[order])).toBeNull();
 expect(nextBookingAction(enquiry,[interested],[{...order,status:"confirmed",cancellation_pending:true}]).stage).toBe("bookings");
 expect(orderStatus({...order,status:"confirmed",invoice_overdue:true})).toMatch(/deadline passed/);
 expect(orderStatus({...order,status:"review"})).toMatch(/do not pay again/);
 expect(orderStatus({...order,status:"paid",cancellation_pending:true})).toMatch(/Cancellation requested/);
});

test("canonical classroom entry is limited to paid live sessions within their join window",()=>{
 const row={id:"order",request_id:"request",kind:"tutoring",source:"portal",mode:"live",status:"paid",request_status:"reviewing",start_at:"2026-12-09T07:00:00Z",end_at:"2026-12-09T08:00:00Z"};
 const now=Date.parse("2026-12-09T07:00:00Z");
 expect(canJoinFamilySession(row,now)).toBe(true);
 expect(canJoinFamilySession({...row,source:"member"},now)).toBe(true);
 expect(canJoinFamilySession({...row,source:"member",kind:"club",class_id:"class"},now)).toBe(false);
 expect(canJoinFamilySession({...row,source:"member",cancellation_pending:true},now)).toBe(false);
 expect(canJoinFamilySession(row,now-600000)).toBe(true);
 expect(canJoinFamilySession(row,now-600001)).toBe(false);
 expect(canJoinFamilySession(row,now+3600000)).toBe(false);
 for(const change of [{status:"confirmed"},{status:"review"},{source:"legacy"},{cancellation_pending:true},{legacy_checkout:true},{request_status:"closed"},{mode:"written"},{start_at:"invalid"},{request_id:null}])expect(canJoinFamilySession({...row,...change},now)).toBe(false);
 expect(canJoinFamilySession({...row,kind:"club",class_id:"class"},now)).toBe(true);
 expect(canJoinFamilySession({...row,kind:"club"},now)).toBe(false);
});
