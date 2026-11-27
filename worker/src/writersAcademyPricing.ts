import {academyProgramme} from "./writersAcademy";
// Versioned, integer-cent catalogue. Not a payment authorisation or evidence of settlement.
export const ACADEMY_PRICE_VERSION="academy-launch-v1";
export type AcademyPaymentMode="single"|"weekly"|"upfront";
export function academyPrice(programmeId:unknown,mode:unknown){
 const programme=academyProgramme(programmeId);
 if(!programme||!(mode==="single"||mode==="weekly"||mode==="upfront"))return null;
 const count=mode==="single"?1:programme.sessions;
 const total_cents=mode==="upfront"?programme.upfront_cents:count*programme.session_cents;
 const obligations=mode==="weekly"?Array.from({length:count},(_,i)=>({sequence:i+1,amount_cents:programme.weekly_cents,expected_seats:1})):
 [{sequence:0,amount_cents:total_cents,expected_seats:count}];
 return {price_version:ACADEMY_PRICE_VERSION,programme_id:programme.id,payment_mode:mode,audience:programme.audience,session_count:count,session_cents:programme.session_cents,total_cents,savings_cents:count*programme.session_cents-total_cents,obligations};
}
export function validateAcademyPrice(raw:any){
 if(!raw||raw.price_version!==ACADEMY_PRICE_VERSION)return null;
 const expected=academyPrice(raw.programme_id,raw.payment_mode);
 if(!expected||raw.audience!==expected.audience||raw.session_count!==expected.session_count||raw.session_cents!==expected.session_cents||raw.total_cents!==expected.total_cents||raw.savings_cents!==expected.savings_cents||!Array.isArray(raw.obligations)||raw.obligations.length!==expected.obligations.length)return null;
 if(!expected.obligations.every((p,i)=>{const q=raw.obligations[i];return q&&p.sequence===q.sequence&&p.amount_cents===q.amount_cents&&p.expected_seats===q.expected_seats;}))return null;
 return expected;
}
export function academyObligationMatches(raw:any,sequence:unknown,amount:unknown,seats:unknown){
 const quote=validateAcademyPrice(raw);
 return !!quote&&quote.obligations.some(p=>p.sequence===sequence&&p.amount_cents===amount&&p.expected_seats===seats);
}
