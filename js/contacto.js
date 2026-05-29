// ========== MENÚ MÓVIL ==========
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// ========== FORMULARIO DINÁMICO SEGÚN MOTIVO ==========
const motivoSelect = document.getElementById('motivo');
const eventoRow = document.getElementById('eventoRow');
const invitadosRow = document.getElementById('invitadosRow');
const espacioGroup = document.getElementById('espacioGroup');
const mensajeTextarea = document.getElementById('mensaje');

const placeholders = {
    reserva: "Cuéntanos sobre tu evento:\n- Tipo de evento\n- Fecha aproximada\n- Número de invitados\n- ¿Necesitas espacio? (sí/no)\n- Presupuesto estimado\n- Alguna preferencia especial?",
    consulta: "Escribe aquí tu consulta. Te responderemos lo antes posible.",
    menu: "¿Qué tipo de menú te interesa?\n- ¿Para cuántas personas?\n- ¿Alguna alergia o restricción dietética?\n- ¿Prefieres degustación, cóctel o buffet?",
    espacio: "¿Qué espacio te interesa?\n- ¿Para qué fecha?\n- ¿Número aproximado de invitados?\n- ¿Prefieres interior o exterior?"
};

if (motivoSelect) {
    motivoSelect.addEventListener('change', () => {
        const motivo = motivoSelect.value;

        if (motivo === 'reserva') {
            if (eventoRow) eventoRow.style.display = 'flex';
            if (invitadosRow) invitadosRow.style.display = 'flex';
            if (espacioGroup) espacioGroup.style.display = 'none';
            if (mensajeTextarea) mensajeTextarea.placeholder = placeholders.reserva;
            const eventoField = document.getElementById('evento');
            const fechaField = document.getElementById('fecha');
            const invitadosField = document.getElementById('invitados');
            if (eventoField) eventoField.required = true;
            if (fechaField) fechaField.required = true;
            if (invitadosField) invitadosField.required = true;
        } else if (motivo === 'espacio') {
            if (eventoRow) eventoRow.style.display = 'flex';
            if (invitadosRow) invitadosRow.style.display = 'flex';
            if (espacioGroup) espacioGroup.style.display = 'block';
            if (mensajeTextarea) mensajeTextarea.placeholder = placeholders.espacio;
            const eventoField = document.getElementById('evento');
            const fechaField = document.getElementById('fecha');
            const invitadosField = document.getElementById('invitados');
            if (eventoField) eventoField.required = false;
            if (fechaField) fechaField.required = false;
            if (invitadosField) invitadosField.required = false;
        } else if (motivo === 'menu') {
            if (eventoRow) eventoRow.style.display = 'none';
            if (invitadosRow) invitadosRow.style.display = 'flex';
            if (espacioGroup) espacioGroup.style.display = 'none';
            if (mensajeTextarea) mensajeTextarea.placeholder = placeholders.menu;
            const eventoField = document.getElementById('evento');
            const fechaField = document.getElementById('fecha');
            const invitadosField = document.getElementById('invitados');
            if (eventoField) eventoField.required = false;
            if (fechaField) fechaField.required = false;
            if (invitadosField) invitadosField.required = false;
        } else if (motivo === 'consulta') {
            if (eventoRow) eventoRow.style.display = 'none';
            if (invitadosRow) invitadosRow.style.display = 'none';
            if (espacioGroup) espacioGroup.style.display = 'none';
            if (mensajeTextarea) mensajeTextarea.placeholder = placeholders.consulta;
            const eventoField = document.getElementById('evento');
            const fechaField = document.getElementById('fecha');
            const invitadosField = document.getElementById('invitados');
            if (eventoField) eventoField.required = false;
            if (fechaField) fechaField.required = false;
            if (invitadosField) invitadosField.required = false;
        } else {
            if (eventoRow) eventoRow.style.display = 'flex';
            if (invitadosRow) invitadosRow.style.display = 'flex';
            if (espacioGroup) espacioGroup.style.display = 'none';
            if (mensajeTextarea) mensajeTextarea.placeholder = "Escribe aquí tu mensaje...";
        }
    });
}

// ========== FORMULARIO CON NETLIFY FORMS ==========
const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const submitBtn = document.querySelector('.btn-enviar');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        const formData = new FormData(form);
        
        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData
            });
            
            if (response.ok) {
                formMessage.innerHTML = `
                    <div class="alert-success">
                        <i class="fas fa-check-circle"></i> 
                        ¡Mensaje enviado correctamente! Te responderemos en menos de 24 horas.
                    </div>
                `;
                form.reset();
                if (eventoRow) eventoRow.style.display = 'flex';
                if (invitadosRow) invitadosRow.style.display = 'flex';
                if (espacioGroup) espacioGroup.style.display = 'none';
            } else {
                throw new Error('Error al enviar');
            }
        } catch (error) {
            console.error('Error:', error);
            formMessage.innerHTML = `
                <div class="alert-error">
                    <i class="fas fa-exclamation-triangle"></i> 
                    Error al enviar. Por favor, inténtalo de nuevo.
                </div>
            `;
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            setTimeout(() => {
                if (formMessage) formMessage.innerHTML = '';
            }, 5000);
        }
    });
}