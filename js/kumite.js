$(document).ready(function(){
	condicionesIniciales();
	var tiempo_corriendo = null;
	var pizarra = {
		categoria : "",
		minuto : 00,
		segundo : 00,
		aka : 00,
		ao : 00,
		senshu : "",
		C1_AKA : "",
		C1_AO : "",
		C2_AKA : "",
		C2_AO : "",
		kiken : "",
		shikkaku : "",
		kashi : ""
	};
	var temporal = [];
	var minuto;	var segundo;
	var AKA = [];	var AO = [];
	var kiken = "";	var shikkaku = "";
	//	-	Activa grupo de botones necesarios para el control de un combates	-	//
	function activarBotones(){
		$(".grp-btn").prop('disabled', false);
	}

	//	-	Desactiva grupo de botones necesarios para el control de un combates	-	//	
	function desactivarBotones(){
		$(".grp-btn").prop('disabled', true);
	}

	/*	-	Activa Panel Principal Cuando Se Selecciona una Categoria	-	*/
	$('#categoria').change(function(){
		var valor = $(this).val();
		var id =$(this).attr('id');
		switch(valor){
			case 'Junior':
			pizarra.categoria = "Junior"; pizarra.minuto = 2; pizarra.segundo = 0;
			break;
			case 'Cadete':
			pizarra.categoria = "Cadete"; pizarra.minuto = 2; pizarra.segundo = 0;
			break;
			case 'Sub-21':
			pizarra.categoria = "Sub-21"; pizarra.minuto = 3; pizarra.segundo = 0;
			break;
			case 'Senior':
			pizarra.categoria = "Senior"; pizarra.minuto = 3; pizarra.segundo = 0;
			break;
			case 'Libre':
			pizarra.categoria = "Libre"; pizarra.minuto = 1; pizarra.segundo = 30;
			break;
			default:
			condicionesIniciales();
			return;
		}
		inicializarCombate();
		$('#START').prop('disabled', false);
		$('.tiempo').prop('disabled', false);
		$('.amonestacion').prop('disabled', false);//	amonestacion
		$('.descalificacion').prop('disabled', false); //	KK y S
		$('#consola').text("");
	});

	function inicializarCombate( ){
		$.each( pizarra, function( key, val ) {
			console.log("Pizarra: "+key+": "+pizarra[key]);
		});
		temporal = pizarra;
		minuto = pizarra.minuto;
		segundo = pizarra.segundo;
		setTiempo();
	}

	/*	-	eventos que generan los Log necesarios para llevar el control de los combates	-	*/
	function logEventos(mensaje){
		hora = mostrarHora();
		console.log(hora+": "+mensaje);
		$('#consola').append($('<div><b>'+mensaje+':</b> '+pizarra.minuto+':'+pizarra.segundo+
			' | AO: '+pizarra.ao+' - AKA: '+pizarra.aka+' | senshu: '+pizarra.senshu+' '+hora+' </div>'));
	}

	function mostrarHora(){

		var date = new Date( );
		var options = { year: 'numeric', month: '2-digit', day: '2-digit',
		hour:'2-digit', minute: '2-digit', second: '2-digit', hour12: false};
		return (new Intl.DateTimeFormat('es-VE', options).
			format(date).replace(/\//g,'-').replace(',',''));
	}

	$('button').click(function(){
		var valor = $(this).val();
		var id =$(this).attr('id');
		logEventos(id);
	});

	$('select').change(function(){
		var valor = $(this).val();
		var id =$(this).attr('id');
		logEventos(id +" "+valor);
	});

	/*	-	Activacion Manual del Senshu	-	*/


	// Se activa al momento de iniciar un combate
	function condicionesIniciales(){
		//	-	Bloquea todos los botones tipo BUTTON y SELECT 	-	//	
		$('button').prop('disabled', true);
		$('select').prop('disabled', true);
		//	-	Limpia los Log del combate anterior	-	//
		$('#consola').text("");		
		//	-	Se inicializa los display del combates	-	//
		$('#minute').text("00");
		$('#second').text("00");
		$('#AO-PTN').text("00");
		$('#AKA-PTN').text("00");
		//	-	Se activa unicamente el boton SELECT correspondiente a las Categorias	-	//
		$('#categoria').prop('disabled', false);
		$('#categoria').focus();
	}

	function mensajeConfirmacion(evento, accion){
		var retorno;
		alertify.confirm(evento, accion, 
			function(){ 
				retorno = true;
				alertify.success('Senshu Removido'); 
			}, 
			function(){ 
				retorno = false;
				alertify.error('Accion Cancelada');
			}
			);
		return retorno;
	}

	$('#START').click(function(){
		if (validarPizarra()) {

			$('#categoria').prop('disabled', true);
			$('.puntos').prop('disabled', false);

			if ( $(this).val() == 'Comenzar' ){

				desactivarBotones();
				$(this).text('');
				$(this).append('<i class="far fa-stop-circle ">Detener</i>').
				removeClass('btn-success').addClass('btn-warning').val('Detener');

				tiempo_corriendo = setInterval(function(){

					disminuirSegundo();

					if( pizarra.segundo == 0 && pizarra.minuto == 0 ){			
						$("#START").prop('disabled', true);
						clearInterval(tiempo_corriendo);
						activarBotones();
						logEventos('FIN DEL TIEMPO DE COMBATE');
					}

				}, 1000);

			}else{

				clearInterval(tiempo_corriendo);
				activarBotones();
				$(this).text('').append('<i class="far fa-play-circle ">Comenzar</i>').
				removeClass('btn-warning').addClass('btn-success').val('Comenzar');

			}
		}
	});

	$('#RESET').click(function(){
		$('.puntos').prop('disabled', true);
		$("#minute").text(minuto < 10 ? '0' + minuto : minuto);
		$("#second").text(segundo < 10 ? '0' + segundo : segundo);
		$('#START').text('').append('<i class="far fa-play-circle ">Comenzar</i>').
		removeClass('btn-warning').addClass('btn-success').val('Comenzar').prop('disabled', false);
		pizarra.minuto = minuto; pizarra.segundo = segundo;
	});

	function disminuirSegundo( ){
		pizarra.segundo--;
		if (pizarra.segundo == -1) {
			pizarra.segundo = 59;
			pizarra.minuto--;
			if (pizarra.minuto == -1) {
				pizarra.minuto = minuto;
			} 
		}
		setTiempo();
	}

	function disminuirMinuto( ){
		pizarra.minuto--;
		if (pizarra.minuto == -1) {
			pizarra.minuto = minuto; 
		}
		setTiempo();
	}

	function agregarSegundo( ){
		pizarra.segundo++;
		if (pizarra.segundo == 60) {
			pizarra.segundo = 0;
			pizarra.minuto++;
			if (pizarra.minuto > minuto) {
				pizarra.minuto = 0;
			} 
		}
		setTiempo();
	}

	function agregarMinuto( ){
		pizarra.minuto++;
		if (pizarra.minuto > minuto) {
			pizarra.minuto = 0; 
		}
		setTiempo();
	}

	function setTiempo(){		
		$("#minute").text(pizarra.minuto < 10 ? '0' + pizarra.minuto : pizarra.minuto);
		$("#second").text(pizarra.segundo < 10 ? '0' + pizarra.segundo : pizarra.segundo);
	}

	$('.tiempo').click(function(){
		var id =$(this).attr('id');
		switch(id){
			case '-min':
			disminuirMinuto();	break;
			case '-seg':
			disminuirSegundo();	break;
			case '+min':
			agregarMinuto();	break;
			case '+seg':
			agregarSegundo();	break;
		}
	});

	$('.puntos').click(function(){
		id = $(this).prop('id');
		valor = $(this).val();
		if( !id.indexOf('AO') && id.indexOf('UNDO') < 0 ){
			if (pizarra.senshu == ""){
				s = 'AO-SENSHU';
				$('#AKA-SENSHU').prop('disabled', true);
				$('#AO-SENSHU').attr('id', "AO-SENSHU REVOKE").text("").text(s);
				pizarra.senshu = "AO-SENSHU";
			}
			AO.push(valor);
			pizarra.ao = 0;
			$.each( AO, function( key, val ) {
				console.log("AO: "+key+"= "+val);
				pizarra.ao=parseInt(pizarra.ao)+parseInt(val);
				mostrar = pizarra.ao < 10 ? '0'+pizarra.ao : pizarra.ao;
				$("#AO-PTN").text(mostrar);
			});
			console.log("AO: "+pizarra.ao);
		}
		if( !id.indexOf('AKA') && id.indexOf('UNDO') < 0 ){

			if (pizarra.senshu == ""){
				s = 'AKA-SENSHU';
				$('#AO-SENSHU').prop('disabled', true);
				$('#AKA-SENSHU').attr('id', 'AKA-SENSHU REVOKE').text("").text(s);
				pizarra.senshu = "AKA-SENSHU";
			}
			AKA.push(valor);
			pizarra.aka = 0;
			$.each( AKA, function( key, val ) {
				console.log("AKA: "+key+"= "+val);
				pizarra.aka=parseInt(pizarra.aka)+parseInt(val);
				mostrar = pizarra.aka < 10 ? '0'+pizarra.aka : pizarra.aka;
				$("#AKA-PTN").text(mostrar);
			});
			console.log("AKA: "+pizarra.aka);
		}
		
		if( !id.indexOf('AO') && id.indexOf('UNDO') > 0){

			AO.pop();
			pizarra.ao = 0;
			$.each( AO, function( key, val ) {
				console.log("AO: "+key+"= "+val);
				pizarra.ao=parseInt(pizarra.ao)+parseInt(val);
			});
			mostrar = pizarra.ao < 10 ? '0'+pizarra.ao : pizarra.ao;
			$("#AO-PTN").text(mostrar);
		}
		if( !id.indexOf('AKA') && id.indexOf('UNDO') > 0){

			AKA.pop();
			pizarra.aka = 0;
			$.each( AKA, function( key, val ) {
				console.log("AKA: "+key+"= "+val);
				pizarra.aka=parseInt(pizarra.aka)+parseInt(val);
			});
			mostrar = pizarra.aka < 10 ? '0'+pizarra.aka : pizarra.aka;
			$("#AKA-PTN").text(mostrar);
		}

	});

	$('.senshu').click(function(){
		var valor = $(this).val();
		var id = $(this).attr('id');
		var texto = $(this).text();
		var evento = "SENSHU";
		var accion = "Desea Remover Senshu";
		var bool;
		if ( id == texto+" REVOKE" ) {
			$(this).text("");
			$(this).append('<i class="fas fa-check"></i>');
			$(this).attr('id',pizarra.senshu);
			$('.senshu').prop('disabled', false);
			pizarra.senshu = "";
		} else {
			switch(id){
				case 'AO-SENSHU':
				$('#AKA-SENSHU').text("");
				$('#AKA-SENSHU').append('<i class="fas fa-check"></i>');
				$('#AKA-SENSHU').prop('disabled', true);
				$(this).attr('id',id+" REVOKE");
				break;
				case 'AKA-SENSHU':
				$('#AO-SENSHU').text("");			
				$('#AO-SENSHU').append('<i class="fas fa-check"></i>');
				$('#AO-SENSHU').prop('disabled', true);
				$(this).attr('id',id+" REVOKE");
				break;
			}
			$(this).text(id);		
			pizarra.senshu = id;
		}
	});

	$('.amonestacion').change(function(){
		aplicarSancion($(this));
	})

	$('.descalificacion').click(function(){
		if (!pizarra.kiken == "" || !pizarra.shikkaku == "") {
			pizarra.kiken = "";	pizarra.shikkaku = "";	pizarra.kashi = "";
			$('.descalificacion').prop('disabled', false);
		}else{
			aplicarSancion($(this));
			$('.descalificacion').prop('disabled', true);
			$(this).prop('disabled', false);
			alertify.success("KASHI: "+$(this).val().split('-')[0]);
			switch($(this).val().split('-')[0]){
				case 'AO':
					pizarra.kashi = "AKA NO KASHI";
				break;
				case 'AKA':
					pizarra.kashi = "AO NO KASHI";
				break;
			}
		}

	});	

	function aplicarSancion(componente){

		id = componente.attr('id');
		valor = componente.val();
		pizarra[id] = valor;
		console.log(id+": "+pizarra[id]);
	}	
	//	-	FIN DEL SCRIPTS-	//

	function validarPizarra(){
		if ( !pizarra.kiken == "" || !pizarra.shikkaku == "") {			
			// Mensaje Fin del Combate
			alertify.alert("KASHI","Fin del Combate, Ganador: "+pizarra.kashi);
			$('#YAME').prop('disabled', false);
			return false;
		}else{
			if ( pizarra.C1_AO == "4" || pizarra.C2_AO == "4" ) {
			// Mensaje Fin del Combate
			pizarra.kashi = "AKA No Kashi";
			alertify.alert("KASHI",pizarra.kashi);
			return false;
		}			
		if ( pizarra.C1_AKA == "4" || pizarra.C2_AKA == "4" ) {
			// Mensaje Fin del Combate
			pizarra.kashi = "AO No Kashi";
			alertify.alert("KASHI",pizarra.kashi);
			return false;
		}
		return true;
	}
}

	$('#YAME').click(function(){
		condicionesIniciales();
	});
});
