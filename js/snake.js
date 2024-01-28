(() =>
{
	const width = 25;
	const height = 25;
	const maxWidth = width - 1;
	const maxHeight = height - 1;
	const maxSpeed = 250;

	const table = Array.from({length: width * height}).fill(0);

	const HEAD = "head";
	const BODY = "body";
	const TAIL = "tail";
	const FOOD = "food";

	const HORIZONTAL = "h";
	const VERTICAL = "v";
	const UP = 1;
	const UP_RIGHT = 2;
	const RIGHT = 3;
	const DOWN_RIGHT = 4;
	const DOWN = 5;
	const DOWN_LEFT = 6;
	const LEFT = 7;
	const UP_LEFT = 8;

	const SHRINK_MOVES = width; //how many steps to shrink the snake

	const getSpeed = (length = snake.length) => length * 50 * 0.5 - 25;
	const posToXY = pos =>
	{
		return {x: pos % width, y: ~~(pos / width)};
	};

	const xyToPos = xy => xy.y * width + xy.x;

	const startPosition = ~~(table.length / 2);
	const snake = [startPosition];
	// const s = posToXY(startPosition);
	// const a = [1,0, 0,-1, 1,0, 0,1, 0,1, -1,0, -1,0, -1,0, 0,-1, 0,-1, 0,-1, 0,-1, 1,0, 1,0, 1,0, 0,-1, 0,-1, 0,-1, 0,-1, -1,0, -1,0, -1,0, 0,1, 0,1];//, 1,0, 0,1, -1,0, -1,0, -1,0];
	// for(let i = 0; i < a.length; i += 2)
	// {
	// 	let x = s.x + a[i];
	// 	if (x >= width)
	// 	{
	// 		x = 0;
	// 	}
	// 	if (x < 0)
	// 		x = width - 1;
	// 	let y = s.y + a[i + 1];
	// 	if (y >= height)
	// 		y = 0;
	// 	if (y < 0)
	// 		y = height - 1;

	// 	s.x = x;
	// 	s.y = y;
	// 	snake.unshift(xyToPos(s));
	// 	// snake.push(xyToPos(s));
	// }
	let energyCurrent = 0;
	let nextStep = 0;
	let nextTime = 0;
	let time = 0;
	let speed = getSpeed(snake.length + 1);
	let movingDirection = 0;
	let movingDirectionUsed = 0;
	let energyMax = (SHRINK_MOVES + snake.length + 1) * 2;
	const gameOver = false;
	let food;
	const elBoard = document.getElementById("board");
	const elScore = document.getElementById("score");
	const elMaxScore = document.getElementById("max-score");
	const elSpeed = document.getElementById("speed");
	const elMoves = document.getElementById("moves");
	const elEnergy = document.getElementById("energy");
	const elTime = document.getElementById("time");

	for (let i = 0; i < table.length; i++)
	{
		elBoard.append(document.createElement("div"));
	}
	elBoard.style.setProperty("--cols", width);
	elBoard.style.setProperty("--rows", height);

	window.addEventListener("keydown", evt =>
	{
		if (gameOver)
			return;

		switch(evt.key)
		{
			case "ArrowUp":
			{
				if (movingDirectionUsed !== DOWN)
					movingDirection = UP;
				break;
			}
			case "ArrowRight":
			{
				if (movingDirectionUsed !== LEFT)
					movingDirection = RIGHT;
				break;
			}
			case "ArrowDown":
			{
				if (movingDirectionUsed !== UP)
					movingDirection = DOWN;
				break;
			}
			case "ArrowLeft":
			{
				if (movingDirectionUsed !== RIGHT)
					movingDirection = LEFT;
				break;
			}
		}
	});

	const animate = timer =>
	{
		requestAnimationFrame(animate);
		if (timer >= nextTime)
		{
			showTime();
			nextTime = timer + 100;
		}
		if (movingDirection && !~~(Math.random() * 3333))
		{
			addFood();
			draw();
		}

		if (timer < nextStep)
			return;

		speed = getSpeed();
		if (speed > maxSpeed)
			speed = maxSpeed;

		nextStep = timer + 300 - speed;
		if (!timer || movingDirection)
		{
			if (movingDirection && !time)
				time = Date.now();

			move();
			draw();
		}
	};

	const draw = () =>
	{
		for (let i = 0; i < table.length; i++)
		{
			const data = table[i];
			const el = elBoard.children[i];
			if (data.type)
				el.dataset.type = data.type;
			else
				delete el.dataset.type;
			if (data.dir || (data.dir === 0 && snake.length < 3))
				el.dataset.dir = data.dir;
			else
				delete el.dataset.dir;

		}
		document.body.classList.toggle("game-over", gameOver);
		elScore.textContent = snake.length;
		if (snake.length > ~~elMaxScore.textContent)
			elMaxScore.textContent = snake.length;

		const speedPercent = movingDirection ? speed * 100 / maxSpeed : 0;
		const energyPercent = energyMax && snake.length > 1 ? energyCurrent * 100 / energyMax : 0;
		elSpeed.dataset.percent = Math.round(speedPercent);
		elEnergy.dataset.percent = Math.round(energyPercent);
		// elMoves.textContent = moves(snakeMoves);
		elSpeed.style.setProperty("--percent", speedPercent + "%");
		elEnergy.style.setProperty("--percent", energyPercent + "%");
	};

	const moves = count => count * 10 / SHRINK_MOVES;

	const move = () =>
	{
		const lastPosition = snake[0];
		let head = lastPosition;
		switch(movingDirection)
		{
			case UP:
			{
				head -= width;
				if (head < 0)
					head += width * height;
				break;
			}
			case RIGHT:
			{
				head += 1;
				if (head % width === 0)
					head -= width;
				break;
			}
			case DOWN:
			{
				head += width;
				if (head >= width * height)
					head -= width * height;
				break;
			}
			case LEFT:
			{
				head -= 1;
				if (head % width === width - 1 || head < 0)
					head += width;
				break;
			}
		}
		let isAddFood;
		if (lastPosition !== head)
		{
			if (SHRINK_MOVES && moves(--energyCurrent) <= 0)
			{
				energyMax = SHRINK_MOVES + snake.length;
				energyCurrent = energyMax;
				if (snake.length > 1)
				{
					table[snake.pop()] = {};
					notify("shrink");
				}

			}
			if (movingDirectionUsed === movingDirection && snake.length < 2 && Date.now() - time > 10)
				movingDirection = 0;

			snake.unshift(head);

			const tail = snake.pop();
			table[tail] = {};
			const isFood = table[head].type === FOOD;
			if (table[head].type && !isFood)
			{
				notify("hurt");
				const remove = snake.splice(snake.indexOf(head, 1));
				for(let i = 0; i < remove.length; i++)
					table[remove[i]] = {};

				// movingDirection = 0;
				// gameOver = true;

			}
			if ((snake.length < 2 && movingDirection) || isFood)
			{
				snake.push(tail);
				energyCurrent += SHRINK_MOVES + snake.length;
				energyMax = energyCurrent;
				// punish further
				// if (snake.length === 2 && Date.now() - time > 100)
				// 	energyCurrent /= 2;

				if (isFood)
					isAddFood = true;
			}
		}

		for(let i = 0, pXY, type, length = snake.length, tail = length - 1; i < length; i++)
		{
			const pos = snake[i];
			const xy = posToXY(pos);
			let direction = pXY ? getDirection(pXY, xy) : 0;
			if (i === 1)
			{
				table[snake[0]].dir = direction;
			}
			if (i === 0)
				type = HEAD;
			else if (i === tail)
			{
				type = TAIL;
			}
			else
			{
				type = BODY;
			}
			if (i > 1 && length > 2)
			{
				const pPosition = snake[i - 1];
				const p2XY = posToXY(snake[i - 2]);
				const p1XY = posToXY(pPosition);
				const pDirection = getDirection(p2XY, p1XY);
				let corner;
				if (pDirection !== direction && pPosition !== snake[0])
				{
					if (pDirection === UP && direction === RIGHT)
						corner = DOWN_RIGHT;
					else if (pDirection === LEFT && direction === DOWN)
						corner = DOWN_RIGHT;

					else if (pDirection === RIGHT && direction === UP)
						corner = UP_LEFT;
					else if (pDirection === DOWN && direction === LEFT)
						corner = UP_LEFT;

					else if (pDirection === RIGHT && direction === DOWN)
						corner = DOWN_LEFT;
					else if (pDirection === UP && direction === LEFT)
						corner = DOWN_LEFT;

					else if (pDirection === DOWN && direction === RIGHT)
						corner = UP_RIGHT;
					else if (pDirection === LEFT && direction === UP)
						corner = UP_RIGHT;

					table[pPosition].dir = corner;
				}

			}
			if (i !== tail || (length > 2 && i === 1))
				direction = direction === LEFT || direction === RIGHT ? HORIZONTAL : VERTICAL;

			if ((!gameOver || (gameOver && (i === 1 || table[pos].type !== HEAD)))
				&& (!i || (i && pos !== snake[0])))
				table[pos] = {type, dir: direction};
			pXY = xy;
		}
		if (isAddFood)
		{
			notify("grow");
			addFood(true);
		}
		movingDirectionUsed = movingDirection;
	};

	const notify = (type, timeout = 1000) =>
	{
		clearTimeout(notify.timeout);
		notify.callback instanceof Function && notify.callback(type);
		notify.callback = () => elBoard.classList.remove(type);
		elBoard.classList.add(type);
		notify.timeout = setTimeout(notify.callback, timeout);

	};

	const getDirection = (start, end) =>
	{
		let sx = start.x;
		let sy = start.y;
		let ex = end.x;
		let ey = end.y;

		if (sx >= maxWidth && ex <= 0)
			sx -= width;
		if (sx <= 0 && ex >= maxWidth)
			ex -= width;

		if (sy >= maxHeight && ey <= 0)
			sy -= height;
		if (sy <= 0 && ey >= maxHeight)
			ey -= height;

		if (sy < ey)
			return UP;
		if (sx < ex)
			return LEFT;
		if (sx > ex)
			return RIGHT;
		if (sy > ey)
			return DOWN;

		return 0;
	};

	const addFood = check =>
	{
		const empty = [];
		for(let i = 0; i < table.length; i++)
		{
			if (!table[i].type)
				empty.push(i);
			else if (check && i !== snake[0] && table[i].type === FOOD)
				return false;
		}
		food = empty[~~(Math.random() * empty.length)];
		table[food] = {type: FOOD};
		console.log(food, Object.assign(snake));
		return food;
	};

	const timerFormat = t =>
	{
		const seconds = t / 1000;
		const sec = Math.round(seconds);
		const d = ~~(sec / 86_400);
		const h = ~~((sec % 86_400) / 3600);
		const m = ~~((sec % 3600) / 60);
		const s = Math.round(sec % 60);
		return [
			d || h ? (d ? d + "d" : "") + ("" + h).padStart(2, 0) : 0,
			(h || d || m) ? ("" + m).padStart(2,0) : 0,
			("" + s).padStart(2,0) + (seconds - ~~seconds).toFixed(1).slice(1,3)
		].filter(Boolean).join(":");
	};

	const showTime = () =>
	{
		elTime.textContent = timerFormat(time ? Date.now() - time : 0);
	};
	move();
	addFood();
	animate();
})();