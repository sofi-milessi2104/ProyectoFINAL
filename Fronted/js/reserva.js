document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    let currentStep = 1;
    const reservaData = {
        fecha_inicio: null,
        fecha_fin: null,
        adultos: 1,
        niños: 0,
        id_habitacion: null,
        tipo_hab: null,
        precio: 0,
        servicios: [],
        tarjeta: null
    };

    // --- Datos simulados del backend ---
    const habitaciones = [
        { id_hab: 1, tipo_hab: 'Suit', descripcion_hab: 'Espaciosa suite con sala de estar.', imagen: 'https://via.placeholder.com/400x300.png?text=Suite', precio: 3438 },
        { id_hab: 2, tipo_hab: 'River Suit', descripcion_hab: 'Suite con vista al río y balcón.', imagen: 'https://via.placeholder.com/400x300.png?text=River+Suite', precio: 6849 },
        { id_hab: 3, tipo_hab: 'Loft', descripcion_hab: 'Loft moderno con cocina.', imagen: 'https://via.placeholder.com/400x300.png?text=Loft', precio: 10273 },
        { id_hab: 4, tipo_hab: 'River Loft', descripcion_hab: 'Loft con grandes ventanales y vista al río.', imagen: 'https://via.placeholder.com/400x300.png?text=River+Loft', precio: 13755 },
        { id_hab: 5, tipo_hab: 'Super Loft', descripcion_hab: 'Superficie extra y balcón doble.', imagen: 'https://via.placeholder.com/400x300.png?text=Super+Loft', precio: 17123 }
    ];

    const servicios = [
        { id_servicio: 1, tipo_servicio: 'Restaurante', precio_servicio: 500, imagen: 'https://via.placeholder.com/100.png?text=Restaurante' },
        { id_servicio: 2, tipo_servicio: 'Spa & Masajes', precio_servicio: 800, imagen: 'https://via.placeholder.com/100.png?text=Spa' },
        { id_servicio: 3, tipo_servicio: 'Gym', precio_servicio: 0, imagen: 'https://via.placeholder.com/100.png?text=Gym' },
        { id_servicio: 4, tipo_servicio: 'Sauna', precio_servicio: 300, imagen: 'https://via.placeholder.com/100.png?text=Sauna' },
        { id_servicio: 5, tipo_servicio: 'Piscina interior', precio_servicio: 0, imagen: 'https://via.placeholder.com/100.png?text=Piscina' },
        { id_servicio: 6, tipo_servicio: 'Piscina exterior', precio_servicio: 0, imagen: 'https://via.placeholder.com/100.png?text=Piscina' },
        { id_servicio: 7, tipo_servicio: 'Estacionamiento', precio_servicio: 0, imagen: 'https://via.placeholder.com/100.png?text=Parking' }
    ];
    // --- Fin de datos simulados ---

    // Función para calcular la diferencia de días entre dos fechas
    const diffInDays = (date1, date2) => {
        if (!date1 || !date2) return 0;
        const oneDay = 24 * 60 * 60 * 1000;
        const firstDate = new Date(date1);
        const secondDate = new Date(date2);
        return Math.round(Math.abs((firstDate - secondDate) / oneDay));
    };

    // Función para actualizar el panel de resumen
    const updateSummary = () => {
        const dias = diffInDays(reservaData.fecha_inicio, reservaData.fecha_fin);
        
        // Cálculo de precios
        const precioBase = reservaData.precio * dias;
        const precioServicios = reservaData.servicios.reduce((total, id) => {
            const servicio = servicios.find(s => s.id_servicio === id);
            return total + (servicio ? servicio.precio_servicio : 0) * dias;
        }, 0);
        const precioTotal = precioBase + precioServicios;

        // Actualizar los elementos del DOM
        document.getElementById('summary-fecha-inicio').textContent = reservaData.fecha_inicio ? new Date(reservaData.fecha_inicio).toLocaleDateString('es-ES') : '-- / -- / --';
        document.getElementById('summary-fecha-fin').textContent = reservaData.fecha_fin ? new Date(reservaData.fecha_fin).toLocaleDateString('es-ES') : '-- / -- / --';
        document.getElementById('summary-huespedes').textContent = `${reservaData.adultos} adulto(s), ${reservaData.niños || 0} niño(s)`;
        document.getElementById('summary-habitacion').textContent = reservaData.tipo_hab ? `${reservaData.tipo_hab} ($${reservaData.precio} x ${dias} noches)` : 'No seleccionada';
        document.getElementById('summary-servicios').textContent = reservaData.servicios.length > 0 ? reservaData.servicios.map(id => servicios.find(s => s.id_servicio === id).tipo_servicio).join(', ') : 'Ninguno';
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
        updateSummary(); // Actualizar el resumen al renderizar cada paso
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

        // Event listener para actualizar el resumen dinámicamente
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
        const step2 = document.createElement('div');
        step2.className = 'step-content active';
        step2.innerHTML = `
            <h2>Paso 2: Elige Habitación y Servicios</h2>
            <h3>Selecciona una Habitación</h3>
            <div class="room-gallery"></div>
            <h3>Agrega Servicios Adicionales (Precio por noche)</h3>
            <div class="service-list"></div>
            <div class="button-group">
                <button type="button" id="back-step-1" class="back-btn">Atrás</button>
                <button type="button" id="next-step-2" class="next-btn">Siguiente</button>
            </div>
        `;

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
                    <p>$${hab.precio} / Noche</p>
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

        const serviceList = step2.querySelector('.service-list');
        servicios.forEach(serv => {
            const isSelected = reservaData.servicios.includes(serv.id_servicio);
            const item = document.createElement('div');
            item.className = 'service-item';
            item.innerHTML = `
                <input type="checkbox" id="service-${serv.id_servicio}" value="${serv.id_servicio}" ${isSelected ? 'checked' : ''}>
                <label for="service-${serv.id_servicio}">${serv.tipo_servicio} (${serv.precio_servicio > 0 ? '$' + serv.precio_servicio : 'Gratis'})</label>
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
                <h3>Información de Pago</h3>
                
                <div class="form-group">
                    <label for="tarjeta">Número de Tarjeta</label>
                    <input type="text" id="tarjeta" name="tarjeta" required pattern="[0-9]{16}" placeholder="4242424242424242">
                    <small style="color: #777;">Introduce 16 dígitos sin espacios</small>
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
        
        step3.querySelector('#back-step-2').addEventListener('click', () => {
            currentStep = 2;
            renderStep();
        });

        step3.querySelector('#step3-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Recolección de datos para simulación
            reservaData.tarjeta = e.target.querySelector('#tarjeta').value;
            reservaData.nombre_tarjeta = e.target.querySelector('#nombre').value;
            reservaData.vencimiento = e.target.querySelector('#vencimiento').value;
            reservaData.cvc = e.target.querySelector('#cvc').value;
            
            alert('Procesando pago...');
            
            // Log de datos simulados a enviar al "backend"
            console.log('Datos a enviar:', {
                action: 'agregarReserva',
                id_usuario: 1, 
                adultos: reservaData.adultos,
                niños: reservaData.niños,
                fecha_inicio: reservaData.fecha_inicio,
                fecha_fin: reservaData.fecha_fin,
                id_habitacion: reservaData.id_habitacion,
                id_servicios: reservaData.servicios,
                tarjeta: reservaData.tarjeta,
                total: document.getElementById('summary-precio-total').textContent.replace('.', '') // Limpiar formato de miles si existe
            });

            // SIMULACIÓN DE PAGO EXITOSO:
            setTimeout(() => {
                alert('¡Reserva realizada con éxito! 🎉 Su total de $' + document.getElementById('summary-precio-total').textContent + ' ha sido cargado.');
                // window.location.reload(); // Descomentar para recargar y volver al paso 1
            }, 1000);

        });
        return step3;
    };

    // Iniciar la aplicación
    renderStep();
});