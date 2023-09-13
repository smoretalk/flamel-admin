import { ComponentLoader } from 'adminjs'

export const componentLoader = new ComponentLoader()

export const Components = {
  Dashboard: componentLoader.add('Dashboard', './components/Dashboard'),
  DisplayImage: componentLoader.add(
      'DisplayImage',
      './components/DisplayImage',
  ),
  IdQuerySaver: componentLoader.add('IdQuerySaver', './components/IdQuerySaver'),
  ExportCsv: componentLoader.add('ExportCsv', './components/ExportCsv'),
}
