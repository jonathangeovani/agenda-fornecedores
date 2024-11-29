import { useSQLiteContext } from 'expo-sqlite';

export type Supplier = {
  id: number;
  name: string;
  company: string;
  phone: string;
};

export type SupplierDatabase = Supplier & {
  isImportant: number;
  days: string;
};

export type SupplierData = Supplier & {
  isImportant: boolean;
  days: string[];
};

export const useSupplierDatabase = () => {
  const db = useSQLiteContext();

  const addSupplier = async (data: Omit<SupplierData, 'id'>) => {
    const query =
      'INSERT INTO suppliers (name, company, phone, isImportant, days) VALUES ($name, $company, $phone, $isImportant, $days)';
    const params = {
      $name: data.name,
      $company: data.company,
      $phone: data.phone,
      $isImportant: Number(data.isImportant),
      $days: data.days.join(';'),
    };

    try {
      const result = await db.runAsync(query, params);
      const insertedRowId = result.lastInsertRowId;

      return { insertedRowId };
    } catch (error) {
      throw error;
    }
  };

  const getAllSuppliers = async (ordered?: boolean) => {
    try {
      let query = 'SELECT * FROM suppliers';
      if (ordered) query += ' ORDER BY name';
      const response = await db.getAllAsync<SupplierDatabase>(query);

      const result = response.map((supplier) => {
        return {
          id: supplier.id,
          name: supplier.name,
          company: supplier.company,
          phone: supplier.phone,
          isImportant: Boolean(supplier.isImportant),
          days: supplier.days.split(';'),
        };
      });

      return result;
    } catch (error) {
      throw error;
    }
  };

  const getSupplier = async (id: number) => {
    try {
      const query = 'SELECT * FROM suppliers WHERE id = ?';
      const response = await db.getFirstAsync<SupplierDatabase>(query, id);

      if (!response) return;
      return {
        id: response.id,
        name: response.name,
        company: response.company,
        phone: response.phone,
        isImportant: Boolean(response.isImportant),
        days: response.days.split(';'),
      };
    } catch (error) {
      throw error;
    }
  };

  const updateSupplier = async (data: SupplierData) => {
    const query = `
      UPDATE suppliers SET
        name = $name,
        company = $company,
        phone = $phone,
        isImportant = $isImportant,
        days = $days
      WHERE id = $id
    `;
    const params = {
      $id: data.id,
      $name: data.name,
      $company: data.company,
      $phone: data.phone,
      $isImportant: data.isImportant,
      $days: data.days.join(';'),
    };

    try {
      await db.runAsync(query, params);
    } catch (error) {
      throw error;
    }
  };

  const deleteSupplier = async (id: number) => {
    const query = 'DELETE FROM suppliers WHERE id = ?';
    try {
      await db.runAsync(query, id);
    } catch (error) {
      throw error;
    }
  };

  const searchSuppliers = async (searchTerm: string) => {
    try {
      const query = `SELECT * FROM suppliers WHERE name LIKE '%${searchTerm}%' ORDER BY name`;

      const response = await db.getAllAsync<SupplierDatabase>(query);
      if (response) {
        const result = response.map((supplier) => {
          return {
            id: supplier.id,
            name: supplier.name,
            company: supplier.company,
            phone: supplier.phone,
            isImportant: Boolean(supplier.isImportant),
            days: supplier.days.split(';'),
          };
        });

        return result;
      }
    } catch (error) {
      throw error;
    }
  };

  return {
    addSupplier,
    getAllSuppliers,
    searchSuppliers,
    getSupplier,
    updateSupplier,
    deleteSupplier,
  };
};
