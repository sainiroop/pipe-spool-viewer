/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import * as React from "react";
import { Table, SimpleTableDataProvider, ColumnDescription, RowItem, SelectionMode } from "@bentley/ui-components";
import { PropertyRecord, PropertyValue, PropertyValueFormat, PropertyDescription, IModelConnection, IModelApp } from "@bentley/imodeljs-frontend";
import { PipeFeatureOverrideProvider } from "./PipeFeatureOverrideProvider";
import { fitView } from "./Toolbar";

export interface Props {
  /** Custom property pane data provider. */
  data: any[];
  imodel: IModelConnection;
}

/** Table component for the viewer app */
export default class SimpleTableComponent extends React.PureComponent<Props> {

  private _spools: string[] = [];

  private async _updateViewport() {

    let spoolList = "(";
    const count = this._spools.length;
    // prepare list of component ids
    this._spools.forEach((value: any, index: number) => {
      spoolList += "'" + value + "'";
      spoolList += (++index !== count) ? ", " : ")";
    });

    const query = `SELECT ECInstanceId AS id FROM SPxReviewDynamic.P3DPipe
      WHERE Spool IN ${spoolList}
      UNION SELECT ECInstanceId AS id FROM SPxReviewDynamic.P3DPipeInstrument
      WHERE Spool IN ${spoolList}
      UNION SELECT ECInstanceId AS id FROM SPxReviewDynamic.P3DPipingComponent
      WHERE Spool IN ${spoolList}`;

    const elements = [];
    if (this._spools.length > 0) for await (const row of this.props.imodel.query(query)) elements.push(row.id);
    const vp = IModelApp.viewManager.selectedView!;
    vp.featureOverrideProvider = new PipeFeatureOverrideProvider(elements);

    // if spools are selected, zoom in on those elements. else zoom into the entire model.
    this._spools.length > 0 ? vp.zoomToElements(elements) : fitView();
  }

  private _onRowsSelected = async (rowIterator: AsyncIterableIterator<RowItem>) => {

    let row = await rowIterator.next();

    while (!row.done) {
      const spoolID = (row.value.cells[0].record!.value as any).value;
      this._spools.push(spoolID);
      row = await rowIterator.next();
    }

    this._updateViewport();

    return Promise.resolve(true);
  }

  private _onRowsDeselected = async (rowIterator: AsyncIterableIterator<RowItem>) => {

    let row = await rowIterator.next();

    while (!row.done) {
      const spoolID = (row.value.cells[0].record!.value as any).value;
      const index = this._spools.indexOf(spoolID);
      this._spools.splice(index, 1);
      row = await rowIterator.next();
    }

    this._updateViewport();

    return Promise.resolve(true);
  }

  private _getDataProvider = (): SimpleTableDataProvider => {

    const columns: ColumnDescription[] = [];

    columns.push({key: "spool_id", label: "SPOOL ID" });

    const dataProvider: SimpleTableDataProvider = new SimpleTableDataProvider(columns);

    this.props.data.forEach((rowValue: any, index) => {
      const rowItem: RowItem = {key: index.toString(), cells: []};
      const value: PropertyValue = {valueFormat: PropertyValueFormat.Primitive, value: rowValue.spool};
      const description: PropertyDescription = {displayLabel: columns[0].label, name: columns[0].key, typename: "string"};
      rowItem.cells.push({key: columns[0].key, record: new PropertyRecord(value, description)});
      dataProvider.addRow(rowItem);
    });

    return dataProvider;
  }

  public render() {
    return (
      <div style={{ height: "100%" }}>
        <Table dataProvider={this._getDataProvider()} selectionMode={SelectionMode.Multiple} onRowsSelected={this._onRowsSelected} onRowsDeselected={this._onRowsDeselected}/>
      </div>
    );
  }
}
