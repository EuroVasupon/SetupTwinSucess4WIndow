import humps from 'humps';

export default (tableData: any[], tableName: string) => {
  interface Model {
    attributes: {
      [key: string]: unknown;
    };
    tableDetail: {
      tableName: string;
      freezeTableName: boolean;
      underscored: boolean;
      timestamps: boolean;
      paranoid: boolean;
      createdAt?: boolean | string;
      updatedAt?: boolean | string;
      deletedAt?: boolean | string;
    };
  }
  const model: Model = {
    attributes: {},
    tableDetail: {
      tableName,
      freezeTableName: true,
      underscored: true,
      timestamps: false,
      paranoid: false
    }
  };
  tableData.forEach((element: any) => {
    const primaryKey = _definedPrimaryKey(element.Key);
    const type = _definedType(element.Type);
    const allowNull = _definedAllowNull(element.Null);
    const autoIncrement = _definedAutoIncrement(element.Extra);
    const field = element.Field;
    const fieldCamel = humps.camelize(element.Field);
    const defaultValue = _definedDefault(element.Default);

    model.attributes[fieldCamel] = {
      type,
      allowNull,
      defaultValue,
      field,
      primaryKey,
      autoIncrement
    };
    if (fieldCamel === 'createAt' || fieldCamel === 'updateAt') {
      if (model.tableDetail.timestamps) {
        model.tableDetail[
          fieldCamel === 'createAt' ? 'createdAt' : 'updatedAt'
        ] = fieldCamel;
      } else {
        if (fieldCamel === 'createAt') {
          model.tableDetail.createdAt = fieldCamel;
          model.tableDetail.updatedAt = false;
        } else if (fieldCamel === 'updateAt') {
          model.tableDetail.createdAt = false;
          model.tableDetail.updatedAt = fieldCamel;
        }

        model.tableDetail.timestamps = true;
      }
    } else if (fieldCamel === 'deletedAt') {
      model.tableDetail.paranoid = true;
      model.tableDetail.deletedAt = fieldCamel;
    }
  });
  return model;
};

function _definedType(type: string): string | void {
  const regEx = /\d+/g;
  const volumn = type.match(regEx);
  const regEx2 = /(unsigned)/g;
  const volumn2 = type.match(regEx2);

  if (type.toUpperCase().match('TINYINT')) {
    return '$DataTypes.BOOLEAN$';
  } else if (type.toUpperCase().match('JSON')) {
    return '$DataTypes.JSON$';
  } else if (
    type.toUpperCase().search('INT') !== -1 &&
    type.toUpperCase().search('BIGINT') === -1
  ) {
    if (volumn && volumn[0]) {
      if (volumn2 && volumn2[0]) {
        return `$DataTypes.INTEGER(${volumn[0]}).UNSIGNED$`;
      }
      return `$DataTypes.INTEGER(${volumn[0]})$`;
    }
    return '$DataTypes.INTEGER$';
  } else if (type.toUpperCase().search('BIGINT') !== -1) {
    if (volumn && volumn[0]) {
      if (volumn2 && volumn2[0]) {
        return `$DataTypes.INTEGER(${volumn[0]}).UNSIGNED$`;
      }
      return `$DataTypes.INTEGER(${volumn[0]})$`;
    }
    return '$DataTypes.INTEGER$';
  } else if (type.toUpperCase().search('FLOAT') !== -1) {
    if (volumn && volumn[0]) {
      if (volumn2 && volumn2[0]) {
        return `$DataTypes.INTEGER(${volumn[0]},${volumn[1]}).UNSIGNED$`;
      }
      return `$DataTypes.INTEGER(${volumn[0]},${volumn[1]})$`;
    }
    return '$DataTypes.INTEGER$';
  } else if (type.toUpperCase().search('DECIMAL') !== -1) {
    if (volumn && volumn[0]) {
      if (volumn2 && volumn2[0]) {
        return `$DataTypes.INTEGER(${volumn[0]},${volumn[1]}).UNSIGNED$`;
      }
      return `$DataTypes.INTEGER(${volumn[0]},${volumn[1]})$`;
    }
    return '$DataTypes.INTEGER$';
  } else if (type.toUpperCase().search('DOUBLE') !== -1) {
    if (volumn && volumn[0]) {
      if (volumn2 && volumn2[0]) {
        return `$DataTypes.DOUBLE(${volumn[0]},${volumn[1]}).UNSIGNED$`;
      }
      return `$DataTypes.DOUBLE(${volumn[0]},${volumn[1]})$`;
    }
    return '$DataTypes.DOUBLE$';
  } else if (type.toUpperCase().search('VARCHAR') !== -1) {
    if (volumn && volumn[0]) {
      return `$DataTypes.STRING(${volumn})$`;
    }
    return '$DataTypes.STRING$';
  } else if (type.toUpperCase().search('CHAR') !== -1) {
    if (volumn && volumn[0]) {
      return `$DataTypes.STRING(${volumn})$`;
    }
    return '$DataTypes.STRING$';
  } else if (type.toUpperCase().search('TEXT') !== -1) {
    return '$DataTypes.TEXT$';
  } else if (type.toUpperCase().search('TIME') !== -1) {
    return '$DataTypes.DATE$';
  }
}

function _definedDefault(type: string) {
  if (!type) {
    return undefined;
  } else if (type === 'CURRENT_TIMESTAMP' || type === '0000-00-00 00:00:00') {
    return '$DataTypes.NOW$';
  } else if (isNaN(parseInt(type))) {
    return type;
  } else {
    return `$${type}$`;
  }
}

function _definedAllowNull(Null: string) {
  if (Null === 'YES') {
    return true;
  } else {
    return false;
  }
}

function _definedAutoIncrement(extra: string) {
  if (extra === 'auto_increment') {
    return true;
  } else {
    return false;
  }
}

function _definedPrimaryKey(key: string) {
  if (key === 'PRI') {
    return true;
  } else {
    return false;
  }
}
