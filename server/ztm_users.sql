
DROP TABLE  IF EXISTS `ue_tmusers`;
DROP TABLE  IF EXISTS `ue_ztm_users`;
CREATE TABLE `ue_ztm_users` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `firstName` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
 `lastName` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
 `email` varchar(100) COLLATE utf8_unicode_ci UNIQUE NOT NULL,
 `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
 `vows` TINYINT unsigned NOT NULL,
 `agreement` TINYINT unsigned NOT NULL,
 `created` datetime NOT NULL,
 `emailValidated` datetime DEFAULT NULL, 
 `modified` datetime NOT NULL,
 PRIMARY KEY (`id`),
 INDEX(email(100))
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
