




CREATE TABLE builder_modules (
  id int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (id)
);

ALTER TABLE  builder_modules ADD COLUMN   name varchar(128) NOT NULL;
ALTER TABLE  builder_modules ADD COLUMN   path varchar(254) NOT NULL;
ALTER TABLE  builder_modules ADD COLUMN   public int(11) NOT NULL DEFAULT '0';
ALTER TABLE  builder_modules ADD COLUMN database_dsn VARCHAR(254)  NOT NULL DEFAULT '';


CREATE TABLE  builder_part (
  id int(11)  NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (id)
);

ALTER TABLE builder_part ADD COLUMN module_id int(11)  NOT NULL;
ALTER TABLE builder_part ADD COLUMN   name varchar(254)  NOT NULL;
ALTER TABLE builder_part ADD COLUMN   json longtext  NOT NULL DEFAULT '';
ALTER TABLE builder_part ADD COLUMN jsource longtext  NOT NULL DEFAULT '';
ALTER TABLE builder_part ADD COLUMN updated DATETIME ;

#postgres..
ALTER TABLE builder_part ALTER COLUMN json SET DEFAULT '';


CREATE TABLE  builder_tables (
  id int(11)  NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (id)
);

ALTER TABLE builder_tables ADD COLUMN name varchar(128)  NOT NULL;
ALTER TABLE builder_tables ADD COLUMN descrip varchar(254)  NOT NULL;
ALTER TABLE builder_tables ADD COLUMN parent_id int(11)  NOT NULL;
ALTER TABLE builder_tables ADD COLUMN dbschema text  NOT NULL;

ALTER TABLE builder_tables ADD INDEX lookup(parent_id, name);

ALTER TABLE builder_tables COMMENT = 'list of tables (with relations ships and grouping)';
COMMENT ON TABLE builder_tables  IS  'list of tables (with relations ships and grouping)';
