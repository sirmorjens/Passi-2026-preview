import type { CompanyInfo } from "../lib/Company/Companies";

export type CompanyViewProps = {
    visible: boolean;
    pendingCompanyId?: number | null;
    item: CompanyInfo | null;
    next?: CompanyInfo | null;
    prev?: CompanyInfo | null;
    defaultOpen: boolean;
}