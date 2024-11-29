UPDATE
  "user"
SET
  hash = ''
WHERE
  email = 'jjablonski@igus.net';

UPDATE
  "user"
SET
  hash_rt = ''
WHERE
  email = 'jjablonski@igus.net';

UPDATE
  "user"
SET
  email = 'jjablonski@igus.net_BLOCKED'
WHERE
  email = 'jjablonski@igus.net';