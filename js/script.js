var canv = document.getElementById('c1');//получаем canvas
var ctx = canv.getContext('2d');//получаем контекст
var isMouseDown = false;
var radius = 10;
var coords = [];
	//занимаем всю доступную область ширину и высоту
	canv.width = window.innerWidth;
	canv.height = window.innerHeight;
	
	//Создаем два события
	canv.addEventListener('mousedown', function() {
		isMouseDown = true;//когда происходит mousedown - становится в значение true;
	});

	canv.addEventListener('mouseup', function() {
		isMouseDown = false;//когда происходит mouseup - становится в значение false;
		ctx.beginPath();//сбрасываем путь, чтобы финишная точка не соединялась со следующей начальной
		coords.push('mouseup');
	});

	ctx.lineWidth = (radius * 2);
	canv.addEventListener('mousemove', function(e) {
		
		if(isMouseDown) {	
			coords.push([e.clientX, e.clientY]);//добавляем чтобы сюда добавлялся массив с текущим положением мыши
		 
			ctx.lineTo(e.clientX, e.clientY);
			ctx.stroke();//создаем линию, чтобы заполнить пробелы между кругами

			//рисуем круг
			ctx.beginPath();
			ctx.arc(e.clientX, e.clientY, radius, 0, Math.PI * 2);
			ctx.fill();

			ctx.beginPath();//начинает новый путь
			ctx.moveTo(e.clientX, e.clientY);//меняет позицию курсора
		}
	});

	function save () {
		localStorage.setItem('coords', JSON.stringify(coords));//создаем функцию чтобы сохраняла в LocalStorage массив
	}

	function clear() {
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canv.width, canv.height);

		ctx.beginPath();
		ctx.fillStyle = 'black';
	}

	function replay() {
		var timer = setInterval(function() {
			if(!coords.length) {
				clearInterval(timer);//если их нет, то сразу очищаем
				ctx.beginPath();//затем очищаем путь, чтобы можно было дорисовывать что-то
				return;
			}

			var crd = coords.shift(),
			e = {
				clientX: crd['0'],
				clientY: crd['1']
			};

			ctx.lineTo(e.clientX, e.clientY);
			ctx.stroke();//создаем линию, чтобы заполнить пробелы между кругами

			//рисует круг
			ctx.beginPath();//чтобы сбрасывать фон, который заполняется
			ctx.arc(e.clientX, e.clientY, radius, 0, Math.PI * 2);//
			ctx.fill();


			ctx.beginPath();//начинает новый путь
			ctx.moveTo(e.clientX, e.clientY);//меняет позицию курсора

		}, 30);
	}

	document.addEventListener('keydown', function(e) {
		console.log(e.keyCode);
		if(e.keyCode == 83) {
			//save-поставили на клавишу s(ее код 83)
			save();
			console.log('Saved');
		}

		if(e.keyCode == 82) {
			//replay - поставили на клавишу r(ее код 82)
			replay();
			console.log('Replayin...');

			coords = JSON.parse(localStorage.getItem('coords'));//массив координат движения мыши, ЗАГРУЗКА
			clear();//очистить
			replay();//воспроизвести
		}

		if(e.keyCode == 67) {
			//clear - поставили на клавишу с(ее код 67)-очищается на белый фон
			clear();
			console.log('Cleared');
		}
	});