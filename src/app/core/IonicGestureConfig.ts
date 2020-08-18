import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';

/**
 * Overrides the default Angular gesture config.
 */


@Injectable()
export class IonicGestureConfig extends HammerGestureConfig {


  constructor() {
    super();
  }

  // FIXME: This gets called every time a new element is creatd. Any way to speed it up?
  buildHammer(element: HTMLElement) {
    const mc = new (<any>window).Hammer(element);

    return mc;
  }
}
