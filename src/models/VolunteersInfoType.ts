export interface BenefitVM {
    iconName: string;
    title: string;
    desc: string;
    order: number;
  }
  
  export interface RequirementVM {
    text: string;
    order: number;
  }
  
  export interface InfoPageVM {
    id: string;
    headerTitle: string;
    headerDescription: string;
    benefits: BenefitVM[];
    requirements: RequirementVM[];
  }
  