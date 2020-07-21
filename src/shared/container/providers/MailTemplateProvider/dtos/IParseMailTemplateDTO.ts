interface ITemplatevariables {
  [key: string]: string | number;
}

export default interface IParsedMailTemplateDTO {
  file: string;
  variables: ITemplatevariables;
}
