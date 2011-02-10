


CREATE TABLE  `builder` (
  `id` int(11)  NOT NULL AUTO_INCREMENT,
  `name` varchar(128)  NOT NULL,
  btype varchar(16)  NOT NULL,
  `json` longtext  NOT NULL,
  PRIMARY KEY (`id`)
);


ALTER TABLE `builder` ADD COLUMN `app` VARCHAR(64)  NOT NULL DEFAULT '';
ALTER TABLE `builder` ADD COLUMN `module` VARCHAR(128)  NOT NULL DEFAULT '';

#-- depreciated..

CREATE TABLE `builder_app` (
  `id` int(11)  NOT NULL AUTO_INCREMENT,
  `app` varchar(64)  NOT NULL,
  `davurl` varchar(128)  NOT NULL,
  `davwrite` int(1)  NOT NULL,
  PRIMARY KEY (`id`)
);
ALTER TABLE builder_app CHANGE COLUMN davwrite davwrite int(2)  NOT NULL DEFAULT 0;
ALTER TABLE builder_app ADD COLUMN `gitpath` varchar(255)  NOT NULL DEFAULT '';


CREATE TABLE `builder_modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `path` varchar(254) NOT NULL,
  `public` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
);
