import { FeatureOverrideProvider, Viewport, FeatureSymbology } from "@bentley/imodeljs-frontend";
import { ElementProps } from "@bentley/imodeljs-common";

export class PipeFeatureOverrideProvider implements FeatureOverrideProvider {

  private _elements: ElementProps[];

  public constructor(elements: ElementProps[]) {
    this._elements = elements;
  }

  // interface function to set feature overrides
  public addFeatureOverrides(_overrides: FeatureSymbology.Overrides, _viewport: Viewport) {

    const appearance = FeatureSymbology.Appearance.fromTransparency(0);
    // if no elements are selected, set default appearance as visible.
    const defaultAppearance = this._elements.length > 0 ? FeatureSymbology.Appearance.fromTransparency(1) : appearance;

    // set default appearance for all elements
    _overrides.setDefaultOverrides(defaultAppearance);
    // set appearance of elements passed in
    if (this._elements) this._elements.forEach( (elementId: any) => {
      if (elementId) _overrides.overrideElement(elementId, appearance);
    });
  }
}
