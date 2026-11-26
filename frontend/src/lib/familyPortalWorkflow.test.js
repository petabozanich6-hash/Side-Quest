import {nextBookingAction,orderStatus,payableOrder} from "./familyPortalWorkflow";
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
