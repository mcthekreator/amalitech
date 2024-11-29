drop view if exists score_view;
create view score_view as
select u.part_number, u.mat_number, count(*) as score
from mat017_usages u
group by u.part_number, u.mat_number
order by score DESC;