import { ComponentLoader } from 'adminjs';
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const componentLoader = new ComponentLoader();
componentLoader.override('FilterDrawer', path.resolve(__dirname, 'components', 'FilterDrawer'));
componentLoader.override('DefaultFilterProperty', path.resolve(__dirname, 'components', 'DefaultFilterProperty'));
export const Components = {
    Dashboard: componentLoader.add('Dashboard', path.resolve(__dirname, 'components', 'Dashboard')),
    DisplayLink: componentLoader.add('DisplayLink', path.resolve(__dirname, 'components', 'DisplayLink')),
    DisplayRank: componentLoader.add('DisplayRank', path.resolve(__dirname, 'components', 'DisplayRank')),
    DisplayNestedImage: componentLoader.add('DisplayNestedImage', path.resolve(__dirname, 'components', 'DisplayNestedImage')),
    PrintImage: componentLoader.add('PrintImage', path.resolve(__dirname, 'components', 'PrintImage')),
    BulkCollectionApprove: componentLoader.add('BulkCollectionApprove', path.resolve(__dirname, 'components', 'BulkCollectionApprove')),
    BulkCollectionReject: componentLoader.add('BulkCollectionReject', path.resolve(__dirname, 'components', 'BulkCollectionReject')),
    DisplayImage: componentLoader.add('DisplayImage', path.resolve(__dirname, 'components', 'DisplayImage')),
    DisplayImageBig: componentLoader.add('DisplayImageBig', path.resolve(__dirname, 'components', 'DisplayImageBig')),
    DisplayStyleImage: componentLoader.add('DisplayStyleImage', path.resolve(__dirname, 'components', 'DisplayStyleImage')),
    ReferenceImage: componentLoader.add('ReferenceImage', path.resolve(__dirname, 'components', 'ReferenceImage')),
    ReferenceImageBig: componentLoader.add('ReferenceImageBig', path.resolve(__dirname, 'components', 'ReferenceImageBig')),
    DisplayLinkBig: componentLoader.add('DisplayLinkBig', path.resolve(__dirname, 'components', 'DisplayLinkBig')),
    DisplayNestedImageBig: componentLoader.add('DisplayNestedImageBig', path.resolve(__dirname, 'components', 'DisplayNestedImageBig')),
    IdQuerySaver: componentLoader.add('IdQuerySaver', path.resolve(__dirname, 'components', 'IdQuerySaver')),
    ExportCsv: componentLoader.add('ExportCsv', path.resolve(__dirname, 'components', 'ExportCsv')),
    ManyToManyEdit: componentLoader.add('ManyToManyEdit', path.resolve(__dirname, 'components', 'M2MEdit')),
    ManyToManyShow: componentLoader.add('ManyToManyShow', path.resolve(__dirname, 'components', 'M2MShow')),
    ManyToManyList: componentLoader.add('ManyToManyList', path.resolve(__dirname, 'components', 'M2MList')),
    DefaultFilterProperty: componentLoader.add('DefaultFilterProperty', path.resolve(__dirname, 'components', 'DefaultFilterProperty')),
    ImageList: componentLoader.add('ImageList', path.resolve(__dirname, 'components', 'List')),
    PreserveQueryList: componentLoader.add('PreserveQueryList', path.resolve(__dirname, 'components', 'PreserveQueryList')),
    EditJSONB: componentLoader.add('EditJSONB', path.resolve(__dirname, 'components', 'EditJSONB')),
    ShowJSONB: componentLoader.add('ShowJSONB', path.resolve(__dirname, 'components', 'ShowJSONB')),
    ImageIdLink: componentLoader.add('ImageIdLink', path.resolve(__dirname, 'components', 'ImageIdLink')),
    LLMPromptIdLink: componentLoader.add('LLMPromptIdLink', path.resolve(__dirname, 'components', 'LLMPromptIdLink')),
    LimitTextLength: componentLoader.add('LimitTextLength', path.resolve(__dirname, 'components', 'LimitTextLength')),
    ImageEmbed: componentLoader.add('ImageEmbed', path.resolve(__dirname, 'components', 'ImageEmbed')),
    CopyAndAssign: componentLoader.add('CopyAndAssign', path.resolve(__dirname, 'components', 'CopyAndAssign')),
    AddEditedImage: componentLoader.add('AddEditedImage', path.resolve(__dirname, 'components', 'AddEditedImage')),
    ReferenceEditWithFilter: componentLoader.add('ReferenceEditWithFilter', path.resolve(__dirname, 'components', 'ReferenceEditWithFilter')),
};
//# sourceMappingURL=componentLoader.js.map