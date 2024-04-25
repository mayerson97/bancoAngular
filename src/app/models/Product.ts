
export class Product {
    id: string;
    name: string;
    description: string;
    logo: string;
    date_release: Date;
    date_revision: Date;

    private constructor(id: string, name: string, description: string, logo: string,
        date_release: Date, date_revision: Date) {

        this.id = id;
        this.name = name;
        this.description = description;
        this.date_release = date_release;
        this.date_revision = date_revision;
        this.logo = logo;
    }

    static crear(id: string, name: string, description: string, logo: string,
        date_release: Date, date_revision: Date): Product {
        return new Product(id, name, description, logo,
            date_release, date_revision);
    }

}
