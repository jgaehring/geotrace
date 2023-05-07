// Join valid strings together with a space, but omit undefined or other values.
const join = (...strings) => strings.filter(s => typeof s === 'string').join(' ');

// To use CSS on an SVG file, without the need to insert a string of raw XML by
// setting the innerHTML, use an <object> element instead and set its data attribute
// to the relative URL of the source file.
export function appendSvgFromUrl(element, src, options) {
  const svgObj = document.createElement('object');
  svgObj.type = 'image/svg+xml';
  svgObj.data = src;
  element.appendChild(svgObj);

  /**
   * The <object> HTML tag is not considered "interactive content", so use an
   * overlay <div> to capture the click event when using an svg icon.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories#interactive_content
   */
  const overlay = document.createElement('div');
  overlay.className = join(options.className, 'interactive-content-overlay');
  element.appendChild(overlay);
}

export function createLiveControl(name, options) {
  const button = document.createElement(options.tag || 'button');
  button.name = name;
  button.type = 'button';
  const className = options.className || `geotrace-${name}`;
  button.className = `${className} ${className}-live-ctrl`;
  if (options.tooltip) button.title = options.tooltip;

  // Add a label to the button, using either the svg or html content from options,
  // or if neither is provided, just the first letter of the name.
  if (options.svg) appendSvgFromUrl(button, options.svg, { className });
  else if (options.html) button.innerHTML = options.html;
  else {
    const html = `<span>${name.trim().slice(0, 1).toUpperCase()}</span>`;
    button.innerHTML = html;
  }

  return button;
}

/**
 * @param {String} name A short name, such as 'draw', that can be used to identify
 * the specific button and to format the CSS classes.
 * @param {Object} [options]
 * @property {String} [options.tag='button'] The HTML element to be used.
 * @property {String} [options.className] Override the format of the CSS class.
 * @property {String} [options.tooltip] Tooltip for the button's `title` attr.
 * @property {String} [options.html] The inner HTML to be inserted as the button label.
 * @property {String} [options.svg] A relative URL to an svg file to be used as the label.
 * @returns {HTMLElement} A new HTMLElelemnt; must be appended to DOM separately.
 */
export function createControlButton(name, options) {
  const button = document.createElement(options.tag || 'button');
  button.name = name;
  button.type = 'button';
  const className = options.className || `ol-${name}`;
  button.className = `${className} ${className}-buttons`;
  if (options.tooltip) button.title = options.tooltip;

  // Add a label to the button, using either the svg or html content from options,
  // or if neither is provided, just the first letter of the name.
  if (options.svg) appendSvgFromUrl(button, options.svg, { className });
  else if (options.html) button.innerHTML = options.html;
  else {
    const html = `<span>${name.trim().slice(0, 1).toUpperCase()}</span>`;
    button.innerHTML = html;
  }

  return button;
}
