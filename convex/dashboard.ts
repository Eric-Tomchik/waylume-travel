import { internalQuery } from "./_generated/server";

export const summaryInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    const leads = await ctx.db.query("travelRequests").collect();
    const quotes = await ctx.db.query("quotes").collect();
    const promotions = await ctx.db.query("promotions").collect();
    const now = Date.now();
    const upcoming = leads.filter(lead => lead.followUpAt && lead.followUpAt >= now).sort((a,b)=>(a.followUpAt ?? 0)-(b.followUpAt ?? 0)).slice(0,5);
    const counts = { new: 0, contacted: 0, quoted: 0, booked: 0, closed: 0 };
    for (const lead of leads) counts[lead.status] += 1;
    return {
      totalLeads: leads.length,
      counts,
      openLeads: leads.filter(lead => lead.status !== "booked" && lead.status !== "closed").length,
      bookedLeads: counts.booked,
      totalQuotes: quotes.length,
      acceptedQuotes: quotes.filter(quote => quote.status === "accepted").length,
      activePromotions: promotions.filter(promo => promo.active).length,
      upcoming,
    };
  },
});
