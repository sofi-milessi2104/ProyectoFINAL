document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    let currentStep = 1;
    
    const habitaciones = [
        { id_hab: 1, tipo_hab: 'Suit', imagen: 'http://localhost/ProyectoFinal/Fronted/img/Suite.jpeg', precio: 3438 },
        { id_hab: 2, tipo_hab: 'River Suit', imagen: 'http://localhost/ProyectoFinal/Fronted/img/River%20Suite.jpeg', precio: 6849 },
        { id_hab: 3, tipo_hab: 'Loft', imagen: 'http://localhost/ProyectoFinal/Fronted/img/Loft.jpeg', precio: 10273 },
        { id_hab: 4, tipo_hab: 'River Loft', imagen: 'http://localhost/ProyectoFinal/Fronted/img/River%20Loft.jpeg', precio: 13755 },
        { id_hab: 5, tipo_hab: 'Super Loft', imagen: 'http://localhost/ProyectoFinal/Fronted/img/Super%20Loft.jpeg', precio: 17123 }
    ];

    const servicios = [
        { id_servicio: 1, tipo_servicio: 'Restaurante', precio_servicio: 0, imagen: 'http://localhost/ProyectoFinal/Fronted/img/Restaurante.jpeg' },
        { id_servicio: 2, tipo_servicio: 'Spa & Masajes', precio_servicio: 500, imagen: 'http://localhost/ProyectoFinal/Fronted/img/Spa.jpeg' },
        { id_servicio: 3, tipo_servicio: 'Gym', precio_servicio: 500, imagen: 'http://localhost/ProyectoFinal/Fronted/img/Gimnasio.jpeg' },
        { id_servicio: 4, tipo_servicio: 'Sauna', precio_servicio: 500, imagen: 'http://localhost/ProyectoFinal/Fronted/img/Sauna.jpeg' },
        { id_servicio: 5, tipo_servicio: 'Piscina interior', precio_servicio: 0, imagen: 'http://localhost/ProyectoFinal/Fronted/img/Piscina%20interior%20-%20cerrada.jpeg' },
        { id_servicio: 6, tipo_servicio: 'Piscina exterior', precio_servicio: 0, imagen: 'http://localhost/ProyectoFinal/Fronted/img/Piscina%20al%20aire%20libre.jpeg' },
        { id_servicio: 7, tipo_servicio: 'Estacionamiento', precio_servicio: 0, imagen: 'http://localhost/ProyectoFinal/Fronted/img/Estacionamiento.jpg' }
    ];

    const preselectedRoomId = localStorage.getItem('selected_room_id');
    let initialRoom = {};
    if (preselectedRoomId) {
        const roomFromStorage = habitaciones.find(h => h.id_hab.toString() === preselectedRoomId);
        if (roomFromStorage) {
            initialRoom = {
                id_habitacion: roomFromStorage.id_hab,
                tipo_hab: roomFromStorage.tipo_hab,
                precio: roomFromStorage.precio,
            };
        }
    }
    
    if (preselectedRoomId) {
        localStorage.removeItem('selected_room_id');
    }

    const reservaData = {
        fecha_inicio: null,
        fecha_fin: null,
        adultos: 1,
        niños: 0,
        id_habitacion: initialRoom.id_habitacion || null,
        tipo_hab: initialRoom.tipo_hab || null,
        precio: initialRoom.precio || 0,
        servicios: [],
        tarjeta: null
    };

    const diffInDays = (date1, date2) => {
        if (!date1 || !date2) return 0;
        const oneDay = 24 * 60 * 60 * 1000;
        const firstDate = new Date(date1);
        const secondDate = new Date(date2);
        const days = Math.round(Math.abs((firstDate - secondDate) / oneDay));
        return days > 0 ? days : 0;
    };

    const updateSummary = () => {
        const dias = diffInDays(reservaData.fecha_inicio, reservaData.fecha_fin) || 1; 
        
        const precioBase = reservaData.precio * dias;
        const precioServicios = reservaData.servicios.reduce((total, id) => {
            const servicio = servicios.find(s => s.id_servicio === id);
            return total + (servicio ? servicio.precio_servicio : 0) * dias;
        }, 0);
        const precioTotal = precioBase + precioServicios;

        document.getElementById('summary-fecha-inicio').textContent = reservaData.fecha_inicio ? new Date(reservaData.fecha_inicio + 'T00:00:00').toLocaleDateString('es-ES') : '-- / -- / --';
        document.getElementById('summary-fecha-fin').textContent = reservaData.fecha_fin ? new Date(reservaData.fecha_fin + 'T00:00:00').toLocaleDateString('es-ES') : '-- / -- / --';
        document.getElementById('summary-huespedes').textContent = `${reservaData.adultos} adulto(s), ${reservaData.niños || 0} niño(s)`;
        
        const habitacionTexto = reservaData.tipo_hab 
            ? `${reservaData.tipo_hab} ($${reservaData.precio.toLocaleString('es-ES')} x ${dias} noches)` 
            : 'No seleccionada';
        document.getElementById('summary-habitacion').textContent = habitacionTexto;
        
        document.getElementById('summary-servicios').textContent = reservaData.servicios.length > 0 
            ? reservaData.servicios.map(id => servicios.find(s => s.id_servicio === id).tipo_servicio).join(', ') 
            : 'Ninguno';
        
        document.getElementById('summary-precio-total').textContent = precioTotal.toLocaleString('es-ES');
    };


    const renderStep = () => {
        app.innerHTML = '';
        let content;

        if (currentStep === 1) {
            content = createStep1();
        } else if (currentStep === 2) {
            content = createStep2();
        } else if (currentStep === 3) {
            content = createStep3();
        }

        app.appendChild(content);
        updateSummary(); 
    };

    const createStep1 = () => {
        const step1 = document.createElement('div');
        step1.className = 'step-content active';
        step1.innerHTML = `
            <h2>Paso 1: Fechas y Huéspedes</h2>
            <form id="step1-form">
                <div class="form-group">
                    <label for="fecha-inicio">Fecha de Entrada</label>
                    <input type="date" id="fecha-inicio" name="fecha_inicio" value="${reservaData.fecha_inicio || ''}" required>
                </div>
                <div class="form-group">
                    <label for="fecha-fin">Fecha de Salida</label>
                    <input type="date" id="fecha-fin" name="fecha_fin" value="${reservaData.fecha_fin || ''}" required>
                </div>
                <div class="form-group">
                    <label for="adultos">Adultos</label>
                    <select id="adultos" name="adultos" required>
                        ${[1, 2, 3].map(val => `<option value="${val}" ${reservaData.adultos == val ? 'selected' : ''}>${val}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="ninos">Niños</label>
                    <select id="ninos" name="ninos">
                        <option value="0" ${reservaData.niños == 0 ? 'selected' : ''}>Ninguno</option>
                        ${[1, 2].map(val => `<option value="${val}" ${reservaData.niños == val ? 'selected' : ''}>${val}</option>`).join('')}
                    </select>
                </div>
                <div class="button-group">
                    <button type="submit" id="next-step-1" class="next-btn">Siguiente</button>
                </div>
            </form>
        `;

        ['fecha-inicio', 'fecha-fin', 'adultos', 'ninos'].forEach(id => {
            const element = step1.querySelector(`#${id}`);
            if (element) {
                element.addEventListener('change', () => {
                    reservaData.fecha_inicio = step1.querySelector('#fecha-inicio').value;
                    reservaData.fecha_fin = step1.querySelector('#fecha-fin').value;
                    reservaData.adultos = step1.querySelector('#adultos').value;
                    reservaData.niños = step1.querySelector('#ninos').value || 0;
                    updateSummary();
                });
            }
        });

        step1.querySelector('#step1-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const fechaInicio = step1.querySelector('#fecha-inicio').value;
            const fechaFin = step1.querySelector('#fecha-fin').value;
            
            if (new Date(fechaFin) <= new Date(fechaInicio)) {
                alert('La fecha de salida debe ser posterior a la de entrada.');
                return;
            }

            reservaData.fecha_inicio = fechaInicio;
            reservaData.fecha_fin = fechaFin;
            reservaData.adultos = parseInt(step1.querySelector('#adultos').value);
            reservaData.niños = parseInt(step1.querySelector('#ninos').value || 0);
            
            currentStep = 2;
            renderStep();
        });

        return step1;
    };

    const createStep2 = () => {
        const roomPreselected = !!initialRoom.id_habitacion;
        
        const roomSelectionContent = roomPreselected 
            ? `
                <div class="alert alert-info" style="
                    padding: 15px; 
                    background-color: #e0f7fa; 
                    border: 1px solid #b2ebf2; 
                    border-radius: 4px; 
                    color: #006064; 
                    margin-bottom: 25px;
                ">
                    Ya ha seleccionado la habitación <strong>${reservaData.tipo_hab}</strong>. 
                    Proceda a seleccionar servicios adicionales. Si desea cambiar la habitación, use el botón "Atrás".
                </div>
              `
            : `
                <h3>Selecciona una Habitación</h3>
                <div class="room-gallery"></div>
              `;

        const step2 = document.createElement('div');
        step2.className = 'step-content active';
        step2.innerHTML = `
            <h2>Paso 2: Elige Habitación y Servicios</h2>
            ${roomSelectionContent}
            <h3>Agrega Servicios Adicionales (Precio por noche)</h3>
            <div class="service-list"></div>
            <div class="button-group">
                <button type="button" id="back-step-1" class="back-btn">Atrás</button>
                <button type="button" id="next-step-2" class="next-btn">Siguiente</button>
            </div>
        `;

        if (!roomPreselected) {
            const roomGallery = step2.querySelector('.room-gallery');
            habitaciones.forEach(hab => {
                const card = document.createElement('div');
                card.className = 'room-card';
                if (reservaData.id_habitacion === hab.id_hab) {
                     card.classList.add('selected');
                }
                card.innerHTML = `
                    <img src="${hab.imagen}" alt="${hab.tipo_hab}">
                    <div class="room-info">
                        <h4>${hab.tipo_hab}</h4>
                        <p>$${hab.precio.toLocaleString('es-ES')} / Noche</p>
                    </div>
                `;
                card.addEventListener('click', () => {
                    document.querySelectorAll('.room-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    reservaData.id_habitacion = hab.id_hab;
                    reservaData.precio = hab.precio;
                    reservaData.tipo_hab = hab.tipo_hab;
                    updateSummary();
                });
                roomGallery.appendChild(card);
            });
        }

        const serviceList = step2.querySelector('.service-list');
        servicios.forEach(serv => {
            const isSelected = reservaData.servicios.includes(serv.id_servicio);
            const item = document.createElement('div');
            item.className = 'service-item';
            item.innerHTML = `
                <input type="checkbox" id="service-${serv.id_servicio}" value="${serv.id_servicio}" ${isSelected ? 'checked' : ''}>
                <label for="service-${serv.id_servicio}">${serv.tipo_servicio} (${serv.precio_servicio > 0 ? '$' + serv.precio_servicio.toLocaleString('es-ES') : 'Gratis'})</label>
            `;
            item.querySelector('input').addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                const serviceId = parseInt(e.target.value);
                if (isChecked) {
                    if (!reservaData.servicios.includes(serviceId)) {
                        reservaData.servicios.push(serviceId);
                    }
                } else {
                    reservaData.servicios = reservaData.servicios.filter(id => id !== serviceId);
                }
                updateSummary();
            });
            serviceList.appendChild(item);
        });

        step2.querySelector('#back-step-1').addEventListener('click', () => {
            currentStep = 1;
            renderStep();
        });
        
        step2.querySelector('#next-step-2').addEventListener('click', () => {
            if (!reservaData.id_habitacion) {
                alert('Debes seleccionar una habitación para continuar.');
                return;
            }
            currentStep = 3;
            renderStep();
        });

        return step2;
    };

    const createStep3 = () => {
        const step3 = document.createElement('div');
        step3.className = 'step-content active';
        step3.innerHTML = `
            <h2>Paso 3: Pago y Confirmación</h2>
            <form id="step3-form">
                <div class="form-group">
                    <label for="tarjeta">Número de Tarjeta</label>
                    <input type="text" id="tarjeta" name="tarjeta" required pattern="[0-9]{16}" placeholder="4242424242424242">
                </div>
                <div class="form-group">
                    <label for="nombre">Nombre en la Tarjeta</label>
                    <input type="text" id="nombre" name="nombre" required placeholder="Jane Doe">
                </div>
                <div class="expiration-cvc">
                    <div class="form-group">
                        <label for="vencimiento">Vencimiento (MM/AA)</label>
                        <input type="text" id="vencimiento" name="vencimiento" required pattern="(0[1-9]|1[0-2])\/[0-9]{2}" placeholder="12/26">
                    </div>
                    <div class="form-group">
                        <label for="cvc">CVC</label>
                        <input type="text" id="cvc" name="cvc" required pattern="[0-9]{3,4}" placeholder="123">
                    </div>
                </div>
                <div class="button-group">
                    <button type="button" id="back-step-2" class="back-btn">Atrás</button>
                    <button type="submit" id="submit-btn" class="next-btn">Confirmar y Pagar</button>
                </div>
            </form>
        `;

step3.querySelector('#step3-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const tarjetaInput = e.target.querySelector('#tarjeta').value;
    const nombreInput = e.target.querySelector('#nombre').value;
    const vencimientoInput = e.target.querySelector('#vencimiento').value;
    const cvcInput = e.target.querySelector('#cvc').value;

    if (vencimientoInput) {
        const partes = vencimientoInput.split('/'); 
        if (partes.length === 2) {
            const mes = parseInt(partes[0]);
            const anioCorto = parseInt(partes[1]);
            
            const anioCompleto = 2000 + anioCorto; 
            
            const fechaLimite = new Date(anioCompleto, mes, 1); 
            const hoy = new Date();

            if (fechaLimite <= hoy) {
                alert('La tarjeta ha expirado. Por favor, verifique la fecha de vencimiento o use otra tarjeta.');
                return;
            }
        } else {

        }
    }

    reservaData.tarjeta = tarjetaInput;
    reservaData.nombre_tarjeta = nombreInput;
    reservaData.vencimiento = vencimientoInput;
    reservaData.cvc = cvcInput;

    const payload = {
        action: 'agregarReserva',
        id_usuario: null, 
        adultos: reservaData.adultos.toString(),
        niños: reservaData.niños.toString(),
        fecha_inicio: reservaData.fecha_inicio,
        fecha_fin: reservaData.fecha_fin,
        id_habitacion: reservaData.id_habitacion,
        servicios: reservaData.servicios,
        tarjeta: reservaData.tarjeta,
        nombre_tarjeta: reservaData.nombre_tarjeta,
        vencimiento: reservaData.vencimiento,
        cvc: reservaData.cvc
    };

            const loader = document.getElementById('loader-overlay');
            const modal = document.getElementById('confirm-modal');
            const resumenDiv = document.getElementById('resumen-reserva');

            loader.style.display = 'flex';

            try {
                const res = await fetch('../Backend/controllers/reserva.php', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();
                loader.style.display = 'none';

                if (data.success) {
                    e.target.reset();
                    reservaData.tarjeta = null;

                    const dias = diffInDays(reservaData.fecha_inicio, reservaData.fecha_fin);
                    const serviciosStr = reservaData.servicios.length > 0 
                        ? reservaData.servicios.map(id => servicios.find(s => s.id_servicio === id).tipo_servicio).join(', ') 
                        : 'Ninguno';
                    
                    const precioHabitacionTotal = reservaData.precio * dias;
                    const precioServiciosTotal = reservaData.servicios.reduce((t,id)=> { 
                        const s = servicios.find(x=>x.id_servicio===id); 
                        return t + (s?s.precio_servicio:0)*dias; 
                    },0);
                    const total = precioHabitacionTotal + precioServiciosTotal;

                    resumenDiv.innerHTML = `
                        <p><strong>Habitación:</strong> ${reservaData.tipo_hab || 'N/A'}</p>
                        <p><strong>Fechas:</strong> ${new Date(reservaData.fecha_inicio + 'T00:00:00').toLocaleDateString('es-ES')} a ${new Date(reservaData.fecha_fin + 'T00:00:00').toLocaleDateString('es-ES')}</p>
                        <p><strong>Adultos:</strong> ${reservaData.adultos}, <strong>Niños:</strong> ${reservaData.niños}</p>
                        <p><strong>Servicios:</strong> ${serviciosStr}</p>
                        <p><strong>Total:</strong> $${total.toLocaleString('es-ES')}</p>
                    `;

                    modal.style.display = 'block';

                } else {
                    alert(data.message || 'Error al realizar la reserva.');
                }

            } catch (err) {
                loader.style.display = 'none';
                console.error("Error al realizar la reserva:", err);
                alert('Error de conexión o al procesar la reserva. Consulte la consola.');
            }
        });

        step3.querySelector('#back-step-2').addEventListener('click', () => {
            currentStep = 2;
            renderStep();
        });
        
        return step3;
    };

    renderStep();

    const cerrarModalBtn = document.getElementById('cerrar-modal');
    cerrarModalBtn.addEventListener('click', () => {
        document.getElementById('confirm-modal').style.display = 'none';
        window.location.href = 'index.html'; 
    });

});
