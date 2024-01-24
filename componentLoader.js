import { ComponentLoader } from 'adminjs';
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const componentLoader = new ComponentLoader();
componentLoader.override('FilterDrawer', path.resolve(__dirname, 'components', 'FilterDrawer'));
export const Components = {
    Dashboard: componentLoader.add('Dashboard', path.resolve(__dirname, 'components', 'Dashboard')),
    DisplayLink: componentLoader.add('DisplayLink', path.resolve(__dirname, 'components', 'DisplayLink')),
    DisplayNestedImage: componentLoader.add('DisplayNestedImage', path.resolve(__dirname, 'components', 'DisplayNestedImage')),
    PrintImage: componentLoader.add('PrintImage', path.resolve(__dirname, 'components', 'PrintImage')),
    DisplayImage: componentLoader.add('DisplayImage', path.resolve(__dirname, 'components', 'DisplayImage')),
    DisplayImageBig: componentLoader.add('DisplayImageBig', path.resolve(__dirname, 'components', 'DisplayImageBig')),
    ReferenceImage: componentLoader.add('ReferenceImage', path.resolve(__dirname, 'components', 'ReferenceImage')),
    ReferenceImageBig: componentLoader.add('ReferenceImageBig', path.resolve(__dirname, 'components', 'ReferenceImageBig')),
    DisplayLinkBig: componentLoader.add('DisplayLinkBig', path.resolve(__dirname, 'components', 'DisplayLinkBig')),
    DisplayNestedImageBig: componentLoader.add('DisplayNestedImageBig', path.resolve(__dirname, 'components', 'DisplayNestedImageBig')),
    IdQuerySaver: componentLoader.add('IdQuerySaver', path.resolve(__dirname, 'components', 'IdQuerySaver')),
    ExportCsv: componentLoader.add('ExportCsv', path.resolve(__dirname, 'components', 'ExportCsv')),
    ManyToManyEdit: componentLoader.add('ManyToManyEdit', path.resolve(__dirname, 'components', 'M2MEdit')),
    ManyToManyShow: componentLoader.add('ManyToManyShow', path.resolve(__dirname, 'components', 'M2MShow')),
    ManyToManyList: componentLoader.add('ManyToManyList', path.resolve(__dirname, 'components', 'M2MList')),
    ImageList: componentLoader.add('ImageList', path.resolve(__dirname, 'components', 'List'))
};
//# sourceMappingURL=componentLoader.js.map