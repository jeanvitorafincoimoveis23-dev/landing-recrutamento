const WHATSAPP_NUMBER = "5500000000000";
const WHATSAPP_MESSAGE = "Olá! Vim pela landing de recrutamento e quero tirar uma dúvida sobre a vaga.";

const form = document.querySelector("#applicationForm");
const statusEl = document.querySelector("#formStatus");
const submitButton = form?.querySelector(".submit-button");

function setupWhatsAppLinks() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  for (const link of document.querySelectorAll("#whatsappTop, #whatsappBottom")) {
    link.setAttribute("href", url);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  }
}

function serializeForm(formElement) {
  const data = new FormData(formElement);
  return {
    company_website: data.get("company_website") || "",
    full_name: data.get("full_name") || "",
    whatsapp: data.get("whatsapp") || "",
    email: data.get("email") || "",
    city: data.get("city") || "",
    age: data.get("age") || "",
    experience_status: data.get("experience_status") || "",
    start_availability: data.get("start_availability") || "",
    motivation: data.get("motivation") || "",
    consent: data.get("consent") === "on"
  };
}

function setStatus(message, type = "neutral") {
  statusEl.textContent = message;
  statusEl.dataset.type = type;
}

async function submitApplication(event) {
  event.preventDefault();
  setStatus("");
  submitButton.disabled = true;
  submitButton.textContent = "Enviando...";

  try {
    const response = await fetch("/api/candidaturas", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(serializeForm(form))
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Nao foi possivel enviar.");

    form.reset();
    setStatus("Candidatura enviada. O time entrará em contato se o seu perfil avançar.", "success");
  } catch (error) {
    setStatus(error.message || "Não foi possível enviar agora. Tente novamente em instantes.", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Enviar candidatura";
  }
}

setupWhatsAppLinks();
form?.addEventListener("submit", submitApplication);
