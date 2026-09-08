document.addEventListener('DOMContentLoaded', function() {
    var btnAds = document.getElementById('btn-calcular-ads');
    
    if (btnAds) {
        btnAds.addEventListener('click', function() {
            var cpcInput = document.getElementById('cpc');
            var clicsInput = document.getElementById('clics');
            var divResultado = document.getElementById('resultado-ads');

            var cpc = parseFloat(cpcInput.value);
            var clics = parseInt(clicsInput.value);

        
            if (isNaN(cpc) || isNaN(clics) || cpc <= 0 || clics <= 0) {
                divResultado.innerHTML = '<p style="color: red; margin-top: 10px;">⚠️ Por favor, ingresa números válidos mayores a 0.</p>';
                return;
            }


            var total = cpc * clics;

    
            var html = '<div style="background-color: #e2e3e5; padding: 15px; border-radius: 6px; margin-top: 15px; border: 1px solid #d6d8db;">' +
                '<p style="margin: 0; font-size: 16px;"><strong>Costo Total Estimado:</strong> $' + total.toLocaleString('es-CL') + ' CLP</p>' +
            '</div>';


            if (total > 50000) {
                html += '<div style="background-color: #fff3cd; color: #856404; border: 1px solid #ffeeba; padding: 12px; border-radius: 5px; margin-top: 10px;">' +
                    '⚠️ <strong>¡Advertencia!</strong> El presupuesto estimado de publicidad supera los $50.000 CLP.' +
                '</div>';
            }

            divResultado.innerHTML = html;
        });
    }

});