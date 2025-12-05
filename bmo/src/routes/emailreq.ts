export async function sendEmailRequest(email: string) {
  try {
    const query = `
      mutation SendEmail($email: String!) {
        sendEmail(email: $email)
      }
    `;

    const res = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { email }
      })
    });

    const json = await res.json();

    const ok = json.data?.sendEmail;

    return ok
      ? { success: true, message: "Email sent!" }
      : { success: false, message: "Email sending failed" };

  } catch {
    return { success: false, message: "Network error" };
  }
}
