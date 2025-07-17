function hslToRgb(h, s, l) {
  let r, g, b;

  s /= 100;
  l /= 100;

  if (s === 0) {
      r = g = b = l; // Achromatic (gray)
  } else {
      const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h / 360 + 1 / 3);
      g = hue2rgb(p, q, h / 360);
      b = hue2rgb(p, q, h / 360 - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function initColorPicker() {
  var canvas = document.getElementById('colorCanvas');
  var canvasContext = canvas.getContext('2d');
  var colorDisplay = document.getElementById('colorDisplay');

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  var radius = Math.min(canvas.width, canvas.height) / 2;
  var gradient = canvasContext.createConicGradient(0, radius, radius);
//creates a gradient around a point
  for (let angle = 0; angle < 360; angle++) {
      const [r, g, b] = hslToRgb(angle, 100, 50);
      gradient.addColorStop(angle / 360, `rgb(${r}, ${g}, ${b})`);
  }

  canvasContext.beginPath();
  canvasContext.arc(radius, radius, radius, 0, 2 * Math.PI);
  canvasContext.closePath();
  canvasContext.clip();

  canvasContext.fillStyle = gradient;
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  canvas.onclick = function (e) {
      var rect = canvas.getBoundingClientRect();
      var x = e.clientX - rect.left - radius;
      var y = e.clientY - rect.top - radius;
      var angle = Math.atan2(y, x);
      var distance = Math.sqrt(x * x + y * y);

      if (distance <= radius) {
          var hue = (angle * (180 / Math.PI) + 360) % 360;
          var saturation = (distance / radius) * 100;

          const [r, g, b] = hslToRgb(hue, saturation, 50);
          var color = `rgb(${r}, ${g}, ${b})`;

          // Update the color display with the RGB values
          colorDisplay.textContent = `Selected Color: rgb(${r}, ${g}, ${b})`;
          colorDisplay.style.color = color; // Change the text color to the selected color
      }
  };
}

// Initialize the color picker once the DOM is fully loaded
window.onload = function () {
  initColorPicker();
};
