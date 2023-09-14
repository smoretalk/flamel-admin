import { ComponentLoader } from 'adminjs'
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const componentLoader = new ComponentLoader()

export const Components = {
  Dashboard: componentLoader.add('Dashboard', path.resolve(__dirname, 'components', 'Dashboard')),
  DisplayImage: componentLoader.add(
      'DisplayImage',
    path.resolve(__dirname, 'components', 'DisplayImage'),
  ),
  DisplayImageBig: componentLoader.add(
    'DisplayImageBig',
    path.resolve(__dirname, 'components', 'DisplayImageBig'),
  ),
  IdQuerySaver: componentLoader.add('IdQuerySaver', path.resolve(__dirname, 'components', 'IdQuerySaver')),
  ExportCsv: componentLoader.add('ExportCsv', path.resolve(__dirname, 'components', 'ExportCsv')),
  ManyToManyEdit: componentLoader.add(
    'ManyToManyEdit',
    path.resolve(__dirname, 'components', 'M2MEdit'),
  ),
  ManyToManyShow: componentLoader.add(
    'ManyToManyShow',
    path.resolve(__dirname, 'components', 'M2MShow'),
  ),
  ManyToManyList: componentLoader.add(
    'ManyToManyList',
    path.resolve(__dirname, 'components', 'M2MList'),
  ),
}
