"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { hasAdminSession } from "@/lib/adminClient";
import { applyAppearance, loadAdminSettings } from "@/lib/adminSettingsClient";

type Lead = {
  _id: string; name: string; email: string; destination: string; dates?: string; travelers: string; budget?: string; tripType: string;
  notes?: string; advisorNotes?: string; followUpAt?: number; status: "new" | "contacted" | "quoted" | "booked" | "closed"; createdAt: number;
};
const statuses: Lead["status"][] = ["new", "contacted", "quoted", "booked", "closed"];

export default function AdminPage() {
  const [token,setToken]=useState(""); const [confirmingDelete,setConfirmingDelete]=useState<string|null>(null); const [deleting,setDeleting]=useState(false); const [leads,setLeads]=useState<Lead[]>([]); const [authorized,setAuthorized]=useState(false); const [error,setError]=useState(""); const [loading,setLoading]=useState(true);
  async function loadLeads(e?:FormEvent){e?.preventDefault();setLoading(true);setError("");const response=await fetch("/api/admin/leads",{headers:token?{"x-admin-token":token}:undefined,cache:"no-store"});if(!response.ok){setAuthorized(false);setError(response.status===401?"Advisor authentication required.":"Unable to load inquiries.");setLeads([]);}else{const data=await response.json();setAuthorized(true);setLeads(data.leads??[]);}setLoading(false);}
  useEffect(()=>{hasAdminSession().then(async ok=>{if(ok){await loadLeads();const settings=await loadAdminSettings();if(settings)applyAppearance(settings);}else setLoading(false);});},[]);

  async function deleteLead(id:string){
    setDeleting(true);setError("");
    const response=await fetch("/api/admin/leads",{method:"DELETE",headers:{"Content-Type":"application/json",...(token?{"x-admin-token":token}:{})},credentials:"same-origin",body:JSON.stringify({id})});
    setDeleting(false);setConfirmingDelete(null);
    if(!response.ok)return setError("Unable to delete this inquiry.");
    setLeads(current=>current.filter(lead=>lead._id!==id));
  }
  async function updateLead(id:string,patch:Partial<Pick<Lead,"status"|"advisorNotes"|"followUpAt">>&{clearFollowUp?:boolean}){const response=await fetch("/api/admin/leads",{method:"PATCH",headers:{"Content-Type":"application/json",...(token?{"x-admin-token":token}:{})},body:JSON.stringify({id,...patch})});if(!response.ok)return setError("Unable to update inquiry.");setLeads(current=>current.map(lead=>lead._id===id?{...lead,...patch,followUpAt:patch.clearFollowUp?undefined:(patch.followUpAt??lead.followUpAt)}:lead));}
  return <main className="admin-shell"><div className="shell">
    <div className="admin-header"><div><Link href="/admin/overview" className="back-link">← Dashboard overview</Link><span className="eyebrow">Advisor workspace</span><h1>Trip inquiry pipeline</h1></div><div className="admin-actions"><Link className="button small" href="/admin/promotions">Promotions</Link><Link className="button small" href="/admin/suppliers">Suppliers</Link><div className="pipeline-stats"><b>{leads.length}</b><span>loaded inquiries</span></div></div></div>
    {loading&&!authorized?<div className="admin-login"><h2>Checking advisor session…</h2></div>:!authorized?<form className="admin-login" onSubmit={loadLeads}><h2>Advisor access</h2><p>Use the secure sign-in page to start an 8-hour session, or enter the legacy passcode here.</p><Link className="button" href="/admin/login">Secure sign in</Link><input type="password" value={token} onChange={e=>setToken(e.target.value)} placeholder="Legacy admin passcode"/><button className="ghost">Open with passcode</button>{error&&<p className="error">{error}</p>}</form>:<div className="lead-list">
      {!leads.length&&<div className="empty-state"><h2>No inquiries yet.</h2><p>New trip requests will appear here automatically after the Convex backend is deployed.</p></div>}
      {leads.map(lead=><article className="lead-card" key={lead._id}><div className="lead-top"><div><small>{new Date(lead.createdAt).toLocaleString()}</small><h2>{lead.name}</h2><a href={`mailto:${lead.email}`}>{lead.email}</a></div><div className="lead-controls"><Link className="ghost" href={`/admin/quotes?requestId=${encodeURIComponent(lead._id)}`}>Quotes</Link><Link className="ghost" href={`/admin/itineraries?requestId=${encodeURIComponent(lead._id)}`}>Itinerary</Link><Link className="ghost" href={`/admin/portal-access?requestId=${encodeURIComponent(lead._id)}&email=${encodeURIComponent(lead.email)}`}>Portal</Link><select value={lead.status} onChange={e=>updateLead(lead._id,{status:e.target.value as Lead["status"]})}>{statuses.map(status=><option key={status}>{status}</option>)}</select>{confirmingDelete===lead._id?<span className="confirm-delete">Delete permanently?<button className="danger-button" disabled={deleting} onClick={()=>deleteLead(lead._id)}>{deleting?"Deleting…":"Yes, delete"}</button><button className="ghost" onClick={()=>setConfirmingDelete(null)}>Keep</button></span>:<button className="danger-button" onClick={()=>setConfirmingDelete(lead._id)}>Delete</button>}</div></div><div className="lead-detail-grid"><div><span>Destination</span><b>{lead.destination}</b></div><div><span>Trip type</span><b>{lead.tripType}</b></div><div><span>Travelers</span><b>{lead.travelers}</b></div><div><span>Dates</span><b>{lead.dates||"Flexible"}</b></div><div><span>Budget</span><b>{lead.budget||"Not specified"}</b></div></div>{lead.notes&&<p className="lead-notes"><strong>Traveler notes:</strong> {lead.notes}</p>}<div className="crm-grid"><label>Advisor notes<textarea value={lead.advisorNotes||""} onChange={e=>setLeads(current=>current.map(item=>item._id===lead._id?{...item,advisorNotes:e.target.value}:item))} onBlur={()=>updateLead(lead._id,{advisorNotes:lead.advisorNotes||""})} placeholder="Research, supplier options, call notes…"/></label><label>Follow-up date<input type="date" value={lead.followUpAt?new Date(lead.followUpAt).toISOString().slice(0,10):""} onChange={e=>e.target.value?updateLead(lead._id,{followUpAt:new Date(`${e.target.value}T12:00:00`).getTime()}):updateLead(lead._id,{clearFollowUp:true})}/></label></div></article>)}
    </div>}
  </div></main>;
}
