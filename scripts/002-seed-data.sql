-- Insert admin user
-- Email: admin@example.com
-- Password: Admin123!
INSERT INTO users (email, password_hash, role) 
VALUES ('admin@example.com', '$2a$10$rXK5mYvz5LZ5mYvz5LZ5mOqK5mYvz5LZ5mYvz5LZ5mOqK5mYvz5LZ', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample candidate user
-- Email: candidate@example.com  
-- Password: Candidate123!
INSERT INTO users (email, password_hash, role) 
VALUES ('candidate@example.com', '$2a$10$sYK6nZw6MaA6nZw6MaA6nOqL6nZw6MaA6nZw6MaA6nOqL6nZw6MaA', 'candidate')
ON CONFLICT (email) DO NOTHING;

-- Insert sample candidate data
INSERT INTO candidates (user_id, first_name, last_name, phone, position, department, status, progress)
SELECT 
  u.id,
  'יוסי',
  'כהן',
  '050-1234567',
  'מפתח תוכנה',
  'פיתוח',
  'in_progress',
  45
FROM users u
WHERE u.email = 'candidate@example.com'
ON CONFLICT DO NOTHING;

-- Insert sample tasks for the candidate
INSERT INTO tasks (candidate_id, title, description, completed)
SELECT 
  c.id,
  'מילוי פרטים אישיים',
  'השלמת טופס פרטים אישיים',
  true
FROM candidates c
JOIN users u ON c.user_id = u.id
WHERE u.email = 'candidate@example.com';

INSERT INTO tasks (candidate_id, title, description, completed)
SELECT 
  c.id,
  'תזמון פגישת זום',
  'קביעת מועד לפגישת זום',
  false
FROM candidates c
JOIN users u ON c.user_id = u.id
WHERE u.email = 'candidate@example.com';

INSERT INTO tasks (candidate_id, title, description, completed)
SELECT 
  c.id,
  'העלאת תמונת רישיון נהיגה',
  'העלאת צילום רישיון נהיגה',
  false
FROM candidates c
JOIN users u ON c.user_id = u.id
WHERE u.email = 'candidate@example.com';

INSERT INTO tasks (candidate_id, title, description, completed)
SELECT 
  c.id,
  'חתימה והעלאת מסמכים משפטיים',
  'חתימה והעלאת מסמכים משפטיים נדרשים',
  false
FROM candidates c
JOIN users u ON c.user_id = u.id
WHERE u.email = 'candidate@example.com';
