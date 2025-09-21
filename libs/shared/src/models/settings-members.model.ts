export interface MemberPermissions {
  view?: AccessAreasPermission;
  edit?: AccessAreasPermission;
}

export interface AccessAreasPermission {
  isChecked: boolean;
  roleId: number;
  roleName: string;
}
