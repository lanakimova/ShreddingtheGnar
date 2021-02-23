UPDATE resorts_info
SET
geometry = (SELECT l.geometry FROM locatons l WHERE l.name LIKE CONCAT('%',resorts_info.name,'%') AND l.name NOT LIKE '%Nordic%' LIMIT 1)
WHERE geometry='Empty';

UPDATE resorts_info
SET
state = (SELECT l.state FROM locatons l WHERE l.name LIKE CONCAT('%',resorts_info.name,'%') AND l.name NOT LIKE '%Nordic%' LIMIT 1)
WHERE state='Empty';

UPDATE resorts_info
SET
website = (SELECT l.website FROM locatons l WHERE l.name LIKE CONCAT('%',resorts_info.name,'%') AND l.name NOT LIKE '%Nordic%' LIMIT 1)
WHERE website='Empty';