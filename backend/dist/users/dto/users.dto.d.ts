export declare class CreateRegUserDto {
    employeeId: string;
    name: string;
    cardNumber?: string;
    validFrom?: string;
    validTo?: string;
    epfNo?: string;
    password?: string;
    nic?: string;
    jobPosition?: string;
    joinDate?: string;
    address?: string;
}
export declare class UpdateRegUserDto {
    name?: string;
    cardNumber?: string;
    email?: string;
    validFrom?: string;
    validTo?: string;
    epfNo?: string;
    nic?: string;
    jobPosition?: string;
    imagePath?: string;
    joinDate?: string;
    address?: string;
}
