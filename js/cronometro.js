$(document).ready(function(){

	// Variables globales
	var tiempo_corriendo = null;
	var temp = {
		hora: 00,
		minuto: 03,
		segundo: 00,
		aka: 00,
		ao:00
	};
	var tiempo = {
		hora: 00,
		minuto: 03,
		segundo: 00,
		aka: 00,
		ao:00		
	};
	// Funciones del cronometro
	function sumarTiempo(){
		if( tiempo.segundo == 00 && tiempo.minuto == 00 && tiempo.hora == 00 ){
			clearInterval(tiempo_corriendo);
		}else{
			// Valida si el contador de Segundos superan los 59 segundos
			if(tiempo.segundo >= 60)
			{
				tiempo.segundo = 0; // Reinicia el segundero
				tiempo.minuto++; // agrega 1 minuto
			}
			// Valida si el contador de minutos superan los 59 minutos
			if(tiempo.minuto >= 60)
			{
				tiempo.minuto = 0; // Reinicia el minutero
				tiempo.hora++; // agrega 1 hora
				if(tiempo.hora == 24){
					tiempo.hora = 00;
				}
			}
		}
	}
	function restarTiempo(){
		if( tiempo.segundo == 00 && tiempo.minuto == 00 && tiempo.hora == 00 ){
			$("#minute").text('03');
			$("#btn-comenzar").text('Comenzar');
			clearInterval(tiempo_corriendo);
		}else{	
			if(tiempo.segundo == -1)
			{
				tiempo.segundo = 59;
				tiempo.minuto--;
			}
			// Minutos
			if(tiempo.minuto == -1)
			{
				tiempo.minuto = 02;
				tiempo.hora--;
			}
			if(tiempo.hora == -1)
			{
				tiempo.hora = 00;
			}		
		}
	}
	function setTiempo(){		
		$("#hour").text(tiempo.hora < 10 ? '0' + tiempo.hora : tiempo.hora);
		$("#minute").text(tiempo.minuto < 10 ? '0' + tiempo.minuto : tiempo.minuto);
		$("#second").text(tiempo.segundo < 10 ? '0' + tiempo.segundo : tiempo.segundo);
		temp.hora = tiempo.hora; temp.minuto = tiempo.minuto; temp.segundo = tiempo.segundo; 
	}
	function addsegundos(){
		tiempo.segundo++;
	}
	function addminutos(){
		tiempo.minuto++;
	}
	function restarsegundos(){
		tiempo.segundo--;
	}
	function restarminutos(){
		tiempo.minuto--;
	}
	function activarBotones(){
		$(".grp-btn").prop('disabled', false);
	}
	function desactivarBotones(){
		$(".grp-btn").prop('disabled', true);
	}


	// Funcion para imprimir en pantalla los eventos	
	
	function imprimirAccion(id, accion, area){
		minuto = temp.minuto < 10 ? '0' + temp.minuto : temp.minuto;
		segundo = temp.segundo < 10 ? '0' + temp.segundo : temp.segundo;
		aka = tiempo.aka < 10 ? '0' + tiempo.aka : tiempo.aka;
		ao = tiempo.ao < 10 ? '0' + tiempo.ao : tiempo.ao;
		area.append($('<div><b>'+id+':</b> '+accion+' '+minuto+':'+segundo+
			' | AO: '+ao+' - AKA: '+aka+' </div>'));
		console.log(id+": "+accion);
	}
	// ***	Funciones basadas en eventos capturados por JQuery -- \\
	$('.evento').change(function(){
		var valor = $(this).val();
		var indice =$(this).attr('id');
		area = $('.cuerpo');
		imprimirAccion(indice, valor, area);
	});

	function agregarPunto(objeto, oponente){
		var evento = objeto.split(" ")[1];
		switch(evento){
			case 'KIKEN':
				alert(objeto+": Combate Finalizado, ganador "+oponente);
			break;
			case 'SHIKKAKU':
				alert(objeto+": Combate Finalizado, ganador "+oponente);
			break;
			default:
				
		}
	}

	$('.puntuacion').click(function(){
		var indice =$(this).attr('id').toUpperCase();
		var valor = $(this).val();
		var color = indice.split(" ")[0];

		switch(color){
			case 'AKA':
				temp.aka = valor > 0 ? valor : 0;
				tiempo.aka = parseInt(tiempo.aka) + parseInt(temp.aka);
				mostrar = tiempo.aka < 10 ? '0'+tiempo.aka : tiempo.aka;
				$(".pto-aka").text("AKA: "+ mostrar);
				agregarPunto(indice, 'AO');
			break;
			case 'AO':
				temp.ao = valor > 0 ? valor : 0;
				tiempo.ao = parseInt(tiempo.ao) + parseInt(temp.ao);
				mostrar = tiempo.ao < 10 ? '0'+ tiempo.ao: tiempo.ao;
				$(".pto-ao").text("AO: "+ mostrar);
				agregarPunto(indice, 'AKA');
			break;
			default:
		}
		area = $('.cuerpo');
		imprimirAccion(indice, valor, area);
	});

	$(".categoria").click(function(){
		tiempo.minuto = $(this).val();
		$("#minute").text('0' + $(this).val());
		tiempo.segundo = 0;
		$("#second").text('00');
	});
	
	$("#btn-reset").click(function(){
		$("#btn-comenzar").text('Comenzar').removeClass('btn-warning').addClass('btn-success').prop('disabled', false);
		clearInterval(tiempo_corriendo);
		$("#hour").text('00');
		$("#minute").text('03');
		$("#second").text('00');
		tiempo = {
			hora: 0,
			minuto: 3,
			segundo: 0
		};
		temp.hora = tiempo.hora; temp.minuto = tiempo.minuto; temp.segundo = tiempo.segundo; 
	});
	$("#btn-addmin").click(function(){
		addminutos();
		sumarTiempo();
		setTiempo();
	});
	$("#btn-addseg").click(function(){
		addsegundos();
		sumarTiempo();
		setTiempo();
	});
	$("#btn-sustmin").click(function(){
		restarminutos();
		restarTiempo();
		setTiempo();
	});
	$("#btn-sustseg").click(function(){
		restarsegundos();
		restarTiempo();
		setTiempo();
	});
	
	// Botones para el control del tiempo //
	$("#btn-comenzar").click(function(){
		if ( $(this).text() == 'Comenzar' ){
			desactivarBotones();
			$(this).text('Detener').removeClass('btn-success').addClass('btn-warning');
			tiempo_corriendo = setInterval(function(){
                // Segundos
                restarsegundos();
                restarTiempo();
                setTiempo();
                if( tiempo.segundo == 00 && tiempo.minuto == 00 && tiempo.hora == 00 ){			
                	$("#btn-comenzar").prop('disabled', true);
                	activarBotones();
                }
            }, 1000);
		}else{
			clearInterval(tiempo_corriendo);
			activarBotones();
			$(this).text('Comenzar').removeClass('btn-warning').addClass('btn-success');
			temp.hora = tiempo.hora; temp.minuto = tiempo.minuto; temp.segundo = tiempo.segundo; 
		}
	});
})	