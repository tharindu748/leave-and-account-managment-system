export declare class CreatePunchDto {
    employeeId: string;
    eventTime: string;
    direction?: 'IN' | 'OUT';
    source: 'device' | 'manual';
    note?: string;
    createdBy?: string;
}
