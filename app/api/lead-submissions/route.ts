import { NextResponse } from "next/server";
import config from "@payload-config";
import { getPayload } from "payload";

type LeadBody = { name?: string; contact?: string; message?: string; source?: string; utmSource?: string; utmMedium?: string; utmCampaign?: string; utmTerm?: string; utmContent?: string; landingPage?: string; referrer?: string };

export async function POST(request: Request) {
  const raw = await request.text();
  let body: LeadBody;
  try { body = JSON.parse(raw) as LeadBody; }
  catch {
    const form = new URLSearchParams(raw);
    body = { name: form.get("name") ?? undefined, contact: form.get("contact") ?? undefined, message: form.get("message") ?? form.get("task") ?? undefined, source: form.get("source") ?? undefined, utmSource: form.get("utmSource") ?? undefined, utmMedium: form.get("utmMedium") ?? undefined, utmCampaign: form.get("utmCampaign") ?? undefined, utmTerm: form.get("utmTerm") ?? undefined, utmContent: form.get("utmContent") ?? undefined, landingPage: form.get("landingPage") ?? undefined, referrer: form.get("referrer") ?? undefined };
  }
  if (!body.name?.trim() || !body.contact?.trim() || !body.message?.trim()) return NextResponse.json({ error: "Заполните обязательные поля" }, { status: 400 });
  const payload = await getPayload({ config });
  const lead = await payload.create({ collection: "leads", data: { name: body.name.trim(), contact: body.contact.trim(), message: body.message.trim(), source: body.source ?? "Сайт", utmSource: body.utmSource, utmMedium: body.utmMedium, utmCampaign: body.utmCampaign, utmTerm: body.utmTerm, utmContent: body.utmContent, landingPage: body.landingPage, referrer: body.referrer }, overrideAccess: true });
  const notification = `Новая заявка: ${lead.name}\nКонтакт: ${lead.contact}\nЗадача: ${lead.message}`;
  const integrations = await payload.findGlobal({ slug: "integrations", overrideAccess: true });
  const telegram = integrations.telegram;
  if (telegram?.enabled && telegram.botToken && telegram.chatId) fetch(`https://api.telegram.org/bot${telegram.botToken}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: telegram.chatId, text: notification }) }).catch(() => undefined);
  for (const crm of [integrations.bitrix24, integrations.amoCrm]) if (crm?.enabled && crm.webhookUrl) fetch(crm.webhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...lead, notification }) }).catch(() => undefined);
  return NextResponse.json({ ok: true, id: lead.id });
}
