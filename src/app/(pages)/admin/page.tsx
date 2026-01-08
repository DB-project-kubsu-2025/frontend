import { redirect, RedirectType } from 'next/navigation'

export default async function AdminPage() {
  redirect('http://localhost:8070/admin', RedirectType.replace);
}
