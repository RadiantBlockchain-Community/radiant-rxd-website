const themeColors = {
  default: {
    sine1: 'rgba(0, 0, 0, 0.3)',
    sine2: 'rgba(0, 122, 116, 0.6)',
    sine3: 'rgba(0, 0, 0, 0.3)'
  },
  light: {
    sine1: 'rgba(255, 255, 255, 0)',
    sine2: 'rgba(120, 210, 250, 0.6)',
    sine3: 'rgba(255, 255, 255, 0)',
  },
  system: {
    sine1: 'rgba(0, 0, 0, 0.3)',
    sine2: 'rgba(0, 122, 116, 0.6)',
    sine3: 'rgba(0, 0, 0, 0.3)'
  }
};

function getThemeColors(themeName) {
  if (themeColors.hasOwnProperty(themeName)) {
    return themeColors[themeName];
  }
  // Fallback to 'default' if themeName is undefined or not found
  return themeColors['default'];
}

var waves = new SineWaves({

  el: document.getElementById('waves'),

  width: () => window.visualViewport.width,

  speed: 4,

  rotate: 0,

  ease: 'SineInOut',

  waveWidth: '100%',

  waves: [
    {
      timeModifier: 1,
      lineWidth: 3,
      amplitude: 180,
      wavelength: 200,
      segmentLength: 10,
    },
    {
      timeModifier: 1,
      lineWidth: 2,
      amplitude: 150,
      wavelength: 100,
      segmentLength: 10,
    },
    {
      timeModifier: 1,
      lineWidth: 1,
      amplitude: -150,
      wavelength: 180,
      segmentLength: 10,
    },
    {
      timeModifier: 1.5,
      lineWidth: 2,
      amplitude: -100,
      wavelength: 200,
      segmentLength: 10,
    }
  ],


  initialize: function () {
    // Determine the current theme from data-theme attribute
    var themeName = document.documentElement.getAttribute("data-theme") || "default";
    var colors = getThemeColors(themeName);
  
    // Create gradient based on the current theme
    var initialGradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
    initialGradient.addColorStop(0, colors.sine1);
    initialGradient.addColorStop(0.5, colors.sine2);
    initialGradient.addColorStop(1, colors.sine3);

    // Apply the gradient to all waves
    for (var i = 0; i < this.waves.length; i++) {
      this.waves[i].strokeStyle = initialGradient;
    }
  },
  
  resizeEvent: function() {
    // Determine the current theme from data-theme attribute
    var themeName = document.documentElement.getAttribute("data-theme") || "default";
    var colors = getThemeColors(themeName);
  
    // Create gradient based on the current theme
    var resizeGradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
    resizeGradient.addColorStop(0, colors.sine1);
    resizeGradient.addColorStop(0.5, colors.sine2);
    resizeGradient.addColorStop(1, colors.sine3);

    // Apply the gradient to all waves
    var index = -1;
    var length = this.waves.length;
    while(++index < length){
      this.waves[index].strokeStyle = resizeGradient;
    }
  },

});

// 3. Add a MutationObserver to listen for changes to the data-theme attribute and update gradients accordingly
(function() {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'data-theme') {
        // Get the updated theme
        var themeName = document.documentElement.getAttribute("data-theme") || "light";
        var colors = themeColors[themeName];
        
        // Create a new gradient based on the updated theme
        var newGradient = waves.ctx.createLinearGradient(0, 0, waves.width, 0);
        newGradient.addColorStop(0, colors.sine1);
        newGradient.addColorStop(0.5, colors.sine2);
        newGradient.addColorStop(1, colors.sine3);
        
        // Apply the new gradient to all waves
        for (var i = 0; i < waves.waves.length; i++) {
          waves.waves[i].strokeStyle = newGradient;
        }
      }
    });
  });

  // Start observing changes to the data-theme attribute on the document element
  observer.observe(document.documentElement, { attributes: true });
})();