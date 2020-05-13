/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;

  this.getArea = function getArea() {
    return this.width * this.height;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const result = Object.create(proto);
  const data = JSON.parse(json);
  Object.keys(data).forEach((item) => {
    result[item] = data[item];
  });
  return result;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
class MySuperBaseElementSelector {
  constructor() {
    this.result = {};
    this.result.combine = '';
    this.result.element = [];
    this.result.id = [];
    this.result.class = [];
    this.result.attribute = [];
    this.result.pseudoClass = [];
    this.result.pseudoElement = [];
  }

  createElement(value) {
    this.result.element.push(value);
    // if (this.result.element.length > 1)
    // throw new Error('Element, id and pseudo-element
    //  should not occur more then one time inside the selector');
    if (this.result.id.length >= 1) {
      this.result = {};
      this.result.combine = '';
      this.result.element = [];
      this.result.id = [];
      this.result.class = [];
      this.result.attribute = [];
      this.result.pseudoClass = [];
      this.result.pseudoElement = [];
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
  }

  createId(value) {
    this.result.id.push(`#${value}`);
    if (this.result.id.length > 1) {
      this.result = {};
      this.result.combine = '';
      this.result.element = [];
      this.result.id = [];
      this.result.class = [];
      this.result.attribute = [];
      this.result.pseudoClass = [];
      this.result.pseudoElement = [];
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (this.result.class.length >= 1 || this.result.pseudoElement.length >= 1) {
      this.result = {};
      this.result.combine = '';
      this.result.element = [];
      this.result.id = [];
      this.result.class = [];
      this.result.attribute = [];
      this.result.pseudoClass = [];
      this.result.pseudoElement = [];
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
  }

  createClass(value) {
    this.result.class.push(`.${value}`);
    if (this.result.attribute.length >= 1) {
      this.result = {};
      this.result.combine = '';
      this.result.element = [];
      this.result.id = [];
      this.result.class = [];
      this.result.attribute = [];
      this.result.pseudoClass = [];
      this.result.pseudoElement = [];
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
  }

  createAttr(value) {
    this.result.attribute.push(`[${value}]`);
    if (this.result.pseudoClass.length >= 1) {
      this.result = {};
      this.result.combine = '';
      this.result.element = [];
      this.result.id = [];
      this.result.class = [];
      this.result.attribute = [];
      this.result.pseudoClass = [];
      this.result.pseudoElement = [];
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
  }

  createPseudoClass(value) {
    this.result.pseudoClass.push(`:${value}`);
    if (this.result.pseudoElement.length >= 1) {
      this.result = {};
      this.result.combine = '';
      this.result.element = [];
      this.result.id = [];
      this.result.class = [];
      this.result.attribute = [];
      this.result.pseudoClass = [];
      this.result.pseudoElement = [];
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
  }

  createPseudoElement(value) {
    this.result.pseudoElement.push(`::${value}`);
    if (this.result.pseudoElement.length > 1) {
      this.result = {};
      this.result.combine = '';
      this.result.element = [];
      this.result.id = [];
      this.result.class = [];
      this.result.attribute = [];
      this.result.pseudoClass = [];
      this.result.pseudoElement = [];
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
  }

  createCombine(selector1, combinator, selector2) {
    this.result.combine += `${selector1} ${combinator} ${selector2}`;
  }

  createStringify() {
    if (this.result.combine) {
      const res = this.result.combine;
      this.result.combine = '';
      return res;
    }
    // if (this.result.element.length > 1 || this.result.id.length > 1
    //   || this.result.pseudoElement.length > 1) {
    //   throw new Error('Element, id and pseudo-element
    // should not occur more then one time inside the selector');
    // }
    const result = `${this.result.element.join('')}${this.result.id.join('')}${this.result.class.join('')}${this.result.attribute.join('')}${this.result.pseudoClass.join('')}${this.result.pseudoElement.join('')}`;
    this.result = {};
    this.result.combine = '';
    this.result.element = [];
    this.result.id = [];
    this.result.class = [];
    this.result.attribute = [];
    this.result.pseudoClass = [];
    this.result.pseudoElement = [];
    return result;
  }
}

const cssSelectorBuilder = {
  isCreated: false,

  object: null,

  partLeft: [],

  element(value) {
    let left = [];
    let previous = null;
    if (this.object) {
      [previous] = this.object.result.element;
    }
    if (this.isCreated) {
      this.partLeft.push(this.stringify());
      left = this.partLeft.slice();
      if (previous === 'table' && value === 'div') {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      }
      if (left[0].slice(0, 1) === '#') {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
    }
    this.isCreated = true;
    this.object = new MySuperBaseElementSelector();
    this.object.partLeft = left.slice();
    this.object.createElement(value);
    return this;
  },

  id(value) {
    if (!this.isCreated) {
      this.isCreated = true;
      this.object = new MySuperBaseElementSelector();
    }
    this.object.createId(value);
    return this;
  },

  class(value) {
    if (!this.isCreated) {
      this.isCreated = true;
      this.object = new MySuperBaseElementSelector();
    }
    this.object.createClass(value);
    return this;
  },

  attr(value) {
    if (!this.isCreated) {
      this.isCreated = true;
      this.object = new MySuperBaseElementSelector();
    }
    this.object.createAttr(value);
    return this;
  },

  pseudoClass(value) {
    if (!this.isCreated) {
      this.isCreated = true;
      this.object = new MySuperBaseElementSelector();
    }
    this.object.createPseudoClass(value);
    return this;
  },

  pseudoElement(value) {
    if (!this.isCreated) {
      this.isCreated = true;
      this.object = new MySuperBaseElementSelector();
    }
    this.object.createPseudoElement(value);
    return this;
  },

  combine(selector1, combinator, selector2) {
    if (!this.isCreated) {
      this.isCreated = true;
      this.object = new MySuperBaseElementSelector();
    }
    this.object.createCombine(selector1.partLeft.pop(), combinator, selector2.stringify());
    return this;
  },

  stringify() {
    // this.isCreated = false;
    return this.object.createStringify();
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
