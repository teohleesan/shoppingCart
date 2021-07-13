export class Utilities {
  static filter<T>(name: string, options: any) : any{
    const filterValue = name.toLowerCase();
    return options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0)
  }
  static displayFnByCode(options: any, returnProp: string) : (code: string) => string | null{
    return (code: string) => {
      const correspondingOption = Array.isArray(options) ? options.find(option => option.code === code) : null;
      return correspondingOption ? correspondingOption[returnProp] : '';
    }
  }
}
