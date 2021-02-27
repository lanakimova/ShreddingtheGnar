ALTER TABLE resorts_info
ADD COLUMN state varchar

ALTER TABLE resorts_info
ADD COLUMN website varchar


UPDATE resorts_info
SET
state = (SELECT l.state FROM locations l WHERE l.name LIKE resorts_info.name OR l.name LIKE CONCAT('%',resorts_info.name,'%') LIMIT 1) 


UPDATE resorts_info
SET
website = (SELECT l.website FROM locations l WHERE (l.name LIKE resorts_info.name OR l.name LIKE CONCAT('%',resorts_info.name,'%')) AND l.name NOT LIKE '%Nordic%' LIMIT 1)

