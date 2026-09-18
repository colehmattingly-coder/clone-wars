(function () {
  function drawBackground(ctx, width, height, time) {
    ctx.save();

    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, '#79d8ff');
    sky.addColorStop(0.62, '#c9f2ff');
    sky.addColorStop(1, '#f8dfad');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    // Slow clouds make the arena feel alive without hiding the play area.
    const drift = (time * 12) % (width + 120);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
    for (const cloud of [[70, 105, 58], [260, 190, 46], [width - 55, 72, 40]]) {
      const cloudX = ((cloud[0] - drift + width + 120) % (width + 120)) - 60;
      ctx.beginPath();
      ctx.arc(cloudX - cloud[2] * 0.45, cloud[1], cloud[2] * 0.32, 0, Math.PI * 2);
      ctx.arc(cloudX, cloud[1] - cloud[2] * 0.18, cloud[2] * 0.42, 0, Math.PI * 2);
      ctx.arc(cloudX + cloud[2] * 0.45, cloud[1], cloud[2] * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Distant arena seating and banners.
    ctx.fillStyle = '#34506c';
    ctx.fillRect(0, height * 0.63, width, height * 0.2);
    ctx.fillStyle = '#4e6e8d';
    for (let row = 0; row < 3; row += 1) {
      const y = height * 0.66 + row * 27;
      ctx.fillRect(0, y, width, 14);
      ctx.fillStyle = row % 2 ? '#f4b942' : '#e85d4a';
      for (let x = -20; x < width + 30; x += 48) {
        ctx.beginPath();
        ctx.moveTo(x, y - 3);
        ctx.lineTo(x + 22, y - 3);
        ctx.lineTo(x + 11, y + 16);
        ctx.closePath();
        ctx.fill();
      }
      ctx.fillStyle = '#4e6e8d';
    }

    ctx.restore();
  }

  function drawGround(ctx, width, height, groundHeight, offset) {
    ctx.save();
    const top = height - groundHeight;
    ctx.fillStyle = '#c88445';
    ctx.fillRect(0, top, width, groundHeight);
    ctx.fillStyle = '#f4c36a';
    ctx.fillRect(0, top, width, 8);
    ctx.strokeStyle = '#5a321e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, top + 8);
    ctx.lineTo(width, top + 8);
    ctx.stroke();

    const tile = 44;
    const shift = -((offset % tile) + tile) % tile;
    ctx.strokeStyle = 'rgba(91, 48, 28, 0.45)';
    ctx.lineWidth = 2;
    for (let x = shift - tile; x < width + tile; x += tile) {
      ctx.beginPath();
      ctx.moveTo(x, top + 12);
      ctx.lineTo(x + tile * 0.55, height);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawBird(ctx, x, y, size, velocity) {
    ctx.save();
    const tilt = Math.max(-0.3, Math.min(0.45, velocity / 900));
    ctx.translate(x, y);
    ctx.rotate(tilt);
    const radius = size * 0.36;

    // Winged basketball, kept inside the requested square.
    ctx.fillStyle = '#f28c28';
    ctx.strokeStyle = '#292b38';
    ctx.lineWidth = Math.max(2, size * 0.075);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#6f3519';
    ctx.lineWidth = Math.max(1.5, size * 0.045);
    ctx.beginPath();
    ctx.arc(-radius * 0.15, 0, radius * 0.95, -1.2, 1.2);
    ctx.moveTo(-radius, -radius * 0.1);
    ctx.quadraticCurveTo(0, radius * 0.1, radius, radius * 0.65);
    ctx.stroke();

    ctx.fillStyle = '#fff8e7';
    ctx.strokeStyle = '#292b38';
    ctx.lineWidth = Math.max(2, size * 0.06);
    ctx.beginPath();
    ctx.moveTo(-radius * 0.72, -radius * 0.12);
    ctx.quadraticCurveTo(-size * 0.55, -size * 0.48, -size * 0.48, -size * 0.1);
    ctx.quadraticCurveTo(-size * 0.62, -size * 0.02, -radius * 0.68, radius * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(radius * 0.72, -radius * 0.12);
    ctx.quadraticCurveTo(size * 0.55, -size * 0.48, size * 0.48, -size * 0.1);
    ctx.quadraticCurveTo(size * 0.62, -size * 0.02, radius * 0.68, radius * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#292b38';
    ctx.beginPath();
    ctx.arc(radius * 0.42, -radius * 0.18, Math.max(1.5, size * 0.045), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawPipe(ctx, x, gapTop, gapBottom, pipeWidth, height) {
    ctx.save();
    const outline = '#292b38';
    const backboard = '#f2f5f7';
    const post = '#596b80';
    const rim = '#e85d2a';

    // The two obstacle rectangles are completely filled; details stay inside them.
    ctx.fillStyle = '#526b83';
    ctx.strokeStyle = outline;
    ctx.lineWidth = 4;
    ctx.fillRect(x, 0, pipeWidth, gapTop);
    ctx.strokeRect(x + 2, 2, pipeWidth - 4, Math.max(0, gapTop - 2));
    ctx.fillRect(x, gapBottom, pipeWidth, Math.max(0, height - gapBottom));
    ctx.strokeRect(x + 2, gapBottom + 2, pipeWidth - 4, Math.max(0, height - gapBottom - 2));

    function hoop(y, upsideDown) {
      const boardW = pipeWidth * 0.68;
      const boardH = Math.min(30, pipeWidth * 0.42);
      const boardX = x + (pipeWidth - boardW) / 2;
      const boardY = upsideDown ? y - boardH : y;
      ctx.fillStyle = backboard;
      ctx.strokeStyle = outline;
      ctx.lineWidth = 3;
      ctx.fillRect(boardX, boardY, boardW, boardH);
      ctx.strokeRect(boardX, boardY, boardW, boardH);
      ctx.fillStyle = rim;
      ctx.strokeStyle = outline;
      ctx.lineWidth = 3;
      ctx.beginPath();
      const rimY = upsideDown ? y - 4 : y + 4;
      ctx.ellipse(x + pipeWidth / 2, rimY, pipeWidth * 0.23, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#f6e8c8';
      ctx.lineWidth = 1.5;
      for (let i = -2; i <= 2; i += 1) {
        ctx.beginPath();
        ctx.moveTo(x + pipeWidth / 2 + i * 5, rimY + (upsideDown ? -2 : 2));
        ctx.lineTo(x + pipeWidth / 2 + i * 3, rimY + (upsideDown ? -13 : 13));
        ctx.stroke();
      }
    }

    if (gapTop > 38) hoop(gapTop, true);
    if (height - gapBottom > 38) hoop(gapBottom, false);
    ctx.fillStyle = post;
    ctx.fillRect(x + pipeWidth * 0.42, 0, pipeWidth * 0.16, Math.max(0, gapTop - 34));
    ctx.fillRect(x + pipeWidth * 0.42, gapBottom + 34, pipeWidth * 0.16, Math.max(0, height - gapBottom - 34));
    ctx.restore();
  }

  window.SPRITES = { drawBackground, drawGround, drawBird, drawPipe };
})();
