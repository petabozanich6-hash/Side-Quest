import React,{act} from "react";
import {createRoot} from "react-dom/client";
import HqSquareInvoiceWorkspace from "./hq/HqSquareInvoiceWorkspace";
import FamilyPortalOverview from "./FamilyPortalOverview";
import {adminApi} from "../../lib/adminApi";
import {api} from "../../lib/api";

let mockParams;
jest.mock("react-router-dom",()=>({
 Link:({to,children,...props})=>require("react").createElement("a",{href:to,...props},children),
 useParams:()=>({channel:"member",requestId:"r1",orderId:"o1"}),
 useLocation:()=>({state:null}),
 useSearchParams:()=>[mockParams,jest.fn()]
}));
jest.mock("../../lib/adminApi",()=>({adminApi:{get:jest.fn(),post:jest.fn()},errorText:(_e,fallback)=>fallback}));
jest.mock("../../lib/api",()=>({api:{get:jest.fn(),post:jest.fn()},apiErrorMessage:(_e,fallback)=>fallback}));

const due="2030-01-02T00:00:00.000Z",fingerprint="a".repeat(64);
const details={sandbox:true,eligible:true,payment_status:"not_issued",recipient:"test@example.com",order:{id:"o1",amount_cents:2500,mode:"written",status:"confirmed"},intent:{fingerprint,state:"draft_created",amount_cents:2500,due_at:due,provider_order_id:"ORD1",provider_invoice_id:"INV1",provider_invoice_version:0},notices:[]};
const familyInvoice={id:"o1",source:"member",subject:"English tutoring",mode:"written",status:"confirmed",amount_cents:2500,square_invoice:{amount_cents:2500,due_at:due}};
const overview={data:{orders:[familyInvoice],clubs:[],threads:[]},refresh:jest.fn()};
const url="https://squareupsandbox.com/pay-invoice/INV1";
let host,root;
const button=label=>Array.from(host.querySelectorAll("button")).find(b=>b.textContent===label);
const click=async el=>{expect(el).toBeTruthy();await act(async()=>{el.click();});};
beforeEach(()=>{
 global.IS_REACT_ACT_ENVIRONMENT=true;
 jest.clearAllMocks();mockParams=new URLSearchParams("page=invoices&invoice=o1");
 host=document.createElement("div");document.body.appendChild(host);root=createRoot(host);
});
afterEach(()=>{act(()=>root.unmount());host.remove();delete global.IS_REACT_ACT_ENVIRONMENT;});

test("owner must inspect exact draft, then explicitly approve publication; reload shows issued payment state",async()=>{
 const issued={...details,payment_status:"awaiting_payment",intent:{...details.intent,state:"issued",provider_invoice_version:1}};
 adminApi.get.mockResolvedValueOnce(details).mockResolvedValue(issued);
 adminApi.post.mockImplementation(async(path)=>{
  if(path.endsWith("/inspect"))return {order_open:true,invoice_checked:true,status:"DRAFT",version:0,provider_invoice_id:"INV1",draft_matches:true,amount_cents:2500,completed_cents:0};
  if(path.endsWith("/publish"))return {issued:true};
  throw Error("Unexpected action");
 });
 await act(async()=>{root.render(<HqSquareInvoiceWorkspace/>);});
 expect(host.textContent).toContain("Unpublished Square draft");expect(button("Approve and issue sandbox invoice")).toBeUndefined();
 const form=host.querySelector("form");
 await act(async()=>{form.dispatchEvent(new Event("submit",{bubbles:true,cancelable:true}));});
 expect(adminApi.post).toHaveBeenCalledWith("/support-invoice-workspace/inspect",{channel:"member",request_id:"r1",order_id:"o1",confirmed:true,fingerprint});
 const issue=button("Approve and issue sandbox invoice");expect(issue.disabled).toBe(true);
 await click(host.querySelector('input[type="checkbox"]'));
 expect(button("Approve and issue sandbox invoice").disabled).toBe(false);
 await click(button("Approve and issue sandbox invoice"));
 expect(adminApi.post).toHaveBeenCalledWith("/support-invoice-workspace/publish",{channel:"member",request_id:"r1",order_id:"o1",confirmed:true,fingerprint,provider_invoice_id:"INV1",version:0,issue_confirmed:true});
 expect(host.querySelector('[data-testid="invoice-payment-status"]').textContent).toBe("Awaiting verified payment");
 expect(button("Approve and issue sandbox invoice")).toBeUndefined();
 expect(button("Check and verify payment")).toBeTruthy();
});

test.each([
 ["paid","verified","Payment verified"],
 ["cancelled","cancelled","Cancelled — no further payment action"],
 ["review","review","Payment requires review — do not charge again"]
])("owner sees distinct %s payment state and cannot trigger another payment check",async(status,payment_status,label)=>{
 adminApi.get.mockResolvedValue({...details,eligible:false,payment_status,order:{...details.order,status},intent:{...details.intent,state:"issued",provider_invoice_version:1},financial_review:status==="review"?{reason:"dispute",last_at:due}:null});
 await act(async()=>{root.render(<HqSquareInvoiceWorkspace/>);});
 expect(host.querySelector('[data-testid="invoice-payment-status"]').textContent).toBe(label);
 expect(button("Check and verify payment")).toBeUndefined();
 expect(button("Approve and issue sandbox invoice")).toBeUndefined();
 expect(host.textContent).not.toContain("Booking remains unpaid");
 expect(adminApi.post).not.toHaveBeenCalled();
});

test("family refresh removes a previously visible payment link during financial review",async()=>{
 api.get.mockResolvedValueOnce({data:{status:"unpaid",payment_url:url}}).mockResolvedValueOnce({data:{status:"review",payment_url:null}});
 await act(async()=>{root.render(<FamilyPortalOverview page="invoices" overview={overview}/>);});
 expect(host.querySelector('a[target="_blank"]').href).toBe(url);
 await click(button("Refresh invoice status"));
 expect(host.querySelector('a[target="_blank"]')).toBeNull();
 expect(host.textContent).toContain("This invoice needs review");
 expect(api.get).toHaveBeenCalledTimes(2);
});

test.each([
 ["verified","Payment verified. Your booking is confirmed."],
 ["cancelled","This booking has been cancelled."],
 ["deadline_passed","The payment deadline has passed."],
 ["payment_review","Square reports payment"]
])("family %s state never offers a payment link",async(status,label)=>{
 api.get.mockResolvedValue({data:{status,payment_url:null}});
 await act(async()=>{root.render(<FamilyPortalOverview page="invoices" overview={overview}/>);});
 expect(host.textContent).toContain(label);expect(host.querySelector('a[target="_blank"]')).toBeNull();
});

test("unknown invoice cannot open another family's record from a crafted URL",async()=>{
 mockParams=new URLSearchParams("page=invoices&invoice=other");
 await act(async()=>{root.render(<FamilyPortalOverview page="invoices" overview={overview}/>);});
 expect(host.textContent).toContain("This invoice is unavailable.");expect(api.get).not.toHaveBeenCalled();
});
