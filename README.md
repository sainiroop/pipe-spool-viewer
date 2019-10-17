# Pipe Spool Viewer - Demo

Copyright © 2019 Bentley Systems, Incorporated. All rights reserved.

An iModel.js sample application that demonstrates how to create a viewer for browsing pipe spools.  This sample is based on [Simple Viewer App](https://github.com/imodeljs/simple-viewer-app) which provides the viewport and view navigation tools.

This app serves as a guide on how you can extend your application to create a simple table component and customize its interaction with the viewport. In this case, the table data is a list of pipe spool IDs in a 3D model. The user can select one or more spools from the table and the viewport updates to display only the pipes belonging to the selected spool(s).  See http://imodeljs.org for comprehensive documentation on the iModel.js API and the various constructs used in this sample.

## Purpose

The purpose of this application is to demonstrate the following:

* Fetching a list of pipe spool ids from an [iModel](./src/frontend/components/App.tsx#L155).
* Displaying the data obtained in a [Table](./src/frontend/components/Table.tsx) component using a simple table data provider.
* Overriding the row selection/deselection events of the [Table](./src/frontend/components/Table.tsx) to fetch piping components with the selected spool id(s).
* Using a viewport [Feature Override](./src/frontend/components/PipeFeatureOverrideProvider.tsx) to only display the components with selected spool id(s) and hide the rest.


## Development Setup

Follow the [Development Setup](https://github.com/imodeljs/simple-viewer-app/blob/master/README.md#development-setup) section under Sample Interactive Apps to configure, install dependencies, build, and run the app.

## Description

As soon as the iModel is opened, the sample fetches a list of unique spool ids assuming the model contains piping data. It then passes this list onto a Table component which uses it to generate a simple data provider. The Table is then rendered using this data provider with multiselect enabled and with row selection/deselection event methods. This component keeps track of all the spools that have currently been selected. Any time a new spool is either selected/deselected, this list is updated and an iModel query is made to get a list of elements with the selected spool id(s). This element list is passed onto the pipe feature override provider which is then set to the viewport. This causes the viewport to only display the elements from this list and hide the rest. Finally, the viewport zooms in on these elements. If no spool ids are selected, the provider defaults to displaying everything in the model.

## Contributing

[Contributing to iModel.js](https://github.com/imodeljs/imodeljs/blob/master/CONTRIBUTING.md)
