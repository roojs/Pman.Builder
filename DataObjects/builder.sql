




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
ALTER TABLE builder_part ADD COLUMN   json longtext  NOT NULL;
ALTER TABLE builder_part SET json longtext  NOT NULL;
ALTER TABLE builder_part ALTER COLUMN SET json SET DEFAULT '';


ALTER TABLE builder_part ADD COLUMN updated DATETIME ;
