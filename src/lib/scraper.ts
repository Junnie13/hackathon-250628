/**
 * Lead scraping service
 * This is a simplified implementation for the MVP
 * In a real implementation, we would use a backend service or a scraping API
 */

import { evaluateLead } from './openai';

/**
 * Types for lead data
 */
export interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  email?: string;
  linkedinUrl?: string;
  industry?: string;
  confidenceScore: number;
  isDecisionMaker: boolean;
  status: 'new' | 'qualified' | 'contacted' | 'responded';
  createdAt: string;
}

/**
 * Types for scraping options
 */
export interface ScrapingOptions {
  source: 'linkedin' | 'google_maps';
  region: string;
  industry: string;
  keywords?: string[];
  maxResults?: number;
}

/**
 * Mock data for generating leads
 */
const mockFirstNames = [
  'Sarah', 'James', 'Emma', 'Michael', 'Olivia', 'William', 'Sophia', 'John',
  'Ava', 'Robert', 'Isabella', 'David', 'Mia', 'Joseph', 'Charlotte', 'Daniel',
  'Amelia', 'Matthew', 'Harper', 'Andrew', 'Evelyn', 'Joshua', 'Abigail', 'Christopher',
  'Emily', 'Nicholas', 'Elizabeth', 'Ryan', 'Sofia', 'Anthony', 'Avery', 'Eric',
  'Ella', 'Stephen', 'Madison', 'Jonathan', 'Scarlett', 'Larry', 'Grace', 'Justin',
  'Chloe', 'Scott', 'Victoria', 'Brandon', 'Riley', 'Benjamin', 'Aria', 'Samuel',
  'Lily', 'Nathan', 'Hannah', 'Christian', 'Layla', 'Jason', 'Zoe', 'Timothy',
  'Samantha', 'Jose', 'Nora', 'Adam', 'Leah', 'Richard', 'Audrey', 'Tyler',
  'Savannah', 'Jeffrey', 'Brooklyn', 'Charles', 'Bella', 'Steven', 'Claire', 'Aaron',
  'Skylar', 'Patrick', 'Lucy', 'Jacob', 'Anna', 'Henry', 'Caroline', 'Douglas',
  'Genesis', 'Peter', 'Aaliyah', 'Trevor', 'Kennedy', 'Zachary', 'Gabriella', 'Kyle',
  'Allison', 'Walter', 'Serenity', 'Harold', 'Hailey', 'Jeremy', 'Autumn', 'Ethan',
  'Nevaeh', 'Carl', 'Stella', 'Keith', 'Ellie', 'Roger', 'Maya', 'Gerald', 'Kaylee',
  'Terry', 'Ariana', 'Sean', 'Faith', 'Austin', 'Kayla', 'Arthur', 'Alyssa', 'Lawrence',
  'Ashley', 'Jesse', 'Brianna', 'Dylan', 'Sophie', 'Bryan', 'Natalie', 'Joe', 'Julia',
  'Jordan', 'Lauren', 'Billy', 'Alice', 'Bruce', 'Madeline', 'Albert', 'Annabelle',
  'Willie', 'Gianna', 'Gabriel', 'Vivian', 'Logan', 'Reagan', 'Alan', 'Clara',
  'Juan', 'Melanie', 'Wayne', 'Aubrey', 'Roy', 'Alexa', 'Ralph', 'Julianna',
  'Randy', 'Arianna', 'Eugene', 'Lillian', 'Vincent', 'Kylie', 'Russell', 'Addison',
  'Louis', 'Lila', 'Philip', 'Paige', 'Bobby', 'Izabella', 'Johnny', 'Camila',
  'Bradley', 'Eva', 'Herbert', 'Jocelyn', 'Frederick', 'Sadie', 'Edwin', 'Lydia',
  'Don', 'Mila', 'Ricky', 'Callie', 'Troy', 'Sienna', 'Randall', 'Adriana',
  'Barry', 'Juliana', 'Alexander', 'Allie', 'Bernard', 'Gabrielle', 'Mario', 'Daisy',
  'Leroy', 'Makenzie', 'Francisco', 'Valeria', 'Marcus', 'Rebecca', 'Micheal', 'Jayla',
  'Theodore', 'Giselle', 'Clifford', 'Vanessa', 'Miguel', 'Daniela', 'Oscar', 'Penelope',
  'Jay', 'Tiffany', 'Jim', 'Kimberly', 'Tom', 'Amber', 'Calvin', 'Rose', 'Alex', 'Alicia',
  'Jon', 'Cynthia', 'Ronnie', 'Jasmine', 'Bill', 'Hope', 'Lloyd', 'Annie', 'Tommy', 'Amaya',
  'Leon', 'Stephanie', 'Derek', 'Melissa', 'Warren', 'Fiona', 'Darrell', 'Angelina',
  'Jerome', 'Everly', 'Floyd', 'Payton', 'Leo', 'Erica', 'Alvin', 'Raegan', 'Tim', 'Molly',
  'Wesley', 'Iris', 'Gordon', 'Emilia', 'Dean', 'Eliana', 'Greg', 'Ivy', 'Jorge', 'Willow',
  'Dustin', 'Josephine', 'Pedro', 'Emery', 'Derrick', 'Lola', 'Dan', 'Hadley', 'Lewis', 'Zara',
  'Zachary', 'Imani', 'Corey', 'Mya', 'Herman', 'Harmony', 'Maurice', 'Keira', 'Vernon', 'Megan',
  'Roberto', 'Alaina', 'Clyde', 'June', 'Glen', 'Rebecca', 'Hector', 'Jessica', 'Shane', 'Michelle',
  'Ricardo', 'Amy', 'Sam', 'Heather', 'Rick', 'Angela', 'Lester', 'Sara', 'Brent', 'Nicole',
  'Ramon', 'Katherine', 'Charlie', 'Emma', 'Tyler', 'Rachel', 'Gilbert', 'Maria', 'Gene', 'Destiny'
];

const mockLastNames = [
  'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson',
  'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin',
  'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee',
  'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright', 'Lopez',
  'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter',
  'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans',
  'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed', 'Cook',
  'Morgan', 'Bell', 'Murphy', 'Bailey', 'Rivera', 'Cooper', 'Richardson', 'Cox',
  'Howard', 'Ward', 'Torres', 'Peterson', 'Gray', 'Ramirez', 'James', 'Watson',
  'Brooks', 'Kelly', 'Sanders', 'Price', 'Bennett', 'Wood', 'Barnes', 'Ross',
  'Henderson', 'Coleman', 'Jenkins', 'Perry', 'Powell', 'Long', 'Patterson', 'Hughes',
  'Flores', 'Washington', 'Butler', 'Simmons', 'Foster', 'Gonzales', 'Bryant', 'Alexander',
  'Russell', 'Griffin', 'Diaz', 'Hayes', 'Myers', 'Ford', 'Hamilton', 'Graham',
  'Sullivan', 'Wallace', 'Woods', 'Cole', 'West', 'Jordan', 'Owens', 'Reynolds',
  'Fisher', 'Ellis', 'Harrison', 'Gibson', 'Mcdonald', 'Cruz', 'Marshall', 'Ortiz',
  'Gomez', 'Murray', 'Freeman', 'Wells', 'Webb', 'Simpson', 'Stevens', 'Tucker',
  'Porter', 'Hunter', 'Hicks', 'Crawford', 'Henry', 'Boyd', 'Mason', 'Morales',
  'Kennedy', 'Warren', 'Dixon', 'Ramos', 'Reyes', 'Burns', 'Gordon', 'Shaw',
  'Holmes', 'Rice', 'Robertson', 'Hunt', 'Black', 'Daniels', 'Palmer', 'Mills',
  'Nichols', 'Grant', 'Knight', 'Ferguson', 'Rose', 'Stone', 'Hawkins', 'Dunn',
  'Perkins', 'Hudson', 'Spencer', 'Gardner', 'Stephens', 'Payne', 'Pierce', 'Berry',
  'Matthews', 'Arnold', 'Wagner', 'Willis', 'Ray', 'Watkins', 'Olson', 'Carroll',
  'Duncan', 'Snyder', 'Hart', 'Cunningham', 'Bradley', 'Lane', 'Andrews', 'Ruiz',
  'Harper', 'Fox', 'Riley', 'Armstrong', 'Carpenter', 'Weaver', 'Greene', 'Lawrence',
  'Elliott', 'Chavez', 'Sims', 'Austin', 'Peters', 'Kelley', 'Franklin', 'Lawson',
  'Fields', 'Gutierrez', 'Ryan', 'Schmidt', 'Carr', 'Vasquez', 'Castillo', 'Wheeler',
  'Chapman', 'Oliver', 'Montgomery', 'Richards', 'Williamson', 'Johnston', 'Banks', 'Meyer',
  'Bishop', 'Mccoy', 'Howell', 'Alvarez', 'Morrison', 'Hansen', 'Fernandez', 'Garza',
  'Harvey', 'Little', 'Burton', 'Stanley', 'Nguyen', 'George', 'Jacobs', 'Reid',
  'Kim', 'Fuller', 'Lynch', 'Dean', 'Gilbert', 'Garrett', 'Romero', 'Welch',
  'Larson', 'Frazier', 'Burke', 'Hanson', 'Day', 'Mendoza', 'Moreno', 'Bowman',
  'Medina', 'Fowler', 'Brewer', 'Hoffman', 'Carlson', 'Silva', 'Pearson', 'Holland',
  'Douglas', 'Fleming', 'Jensen', 'Vargas', 'Byrd', 'Davidson', 'Hopkins', 'May',
  'Terry', 'Herrera', 'Wade', 'Soto', 'Walters', 'Curtis', 'Neal', 'Caldwell',
  'Lowe', 'Jennings', 'Barnett', 'Graves', 'Jimenez', 'Horton', 'Shelton', 'Barrett',
  'Obrien', 'Castro', 'Sutton', 'Gregory', 'Mckinney', 'Lucas', 'Miles', 'Craig',
  'Rodriquez', 'Chambers', 'Holt', 'Lambert', 'Fletcher', 'Watts', 'Bates', 'Hale',
  'Rhodes', 'Pena', 'Beck', 'Newman', 'Haynes', 'Mcdaniel', 'Mendez', 'Bush',
  'Vaughn', 'Parks', 'Dawson', 'Santiago', 'Norris', 'Hardy', 'Love', 'Steele',
  'Curry', 'Powers', 'Schultz', 'Barker', 'Guzman', 'Page', 'Munoz', 'Ball',
  'Keller', 'Chandler', 'Weber', 'Leonard', 'Walsh', 'Lyons', 'Ramsey', 'Wolfe',
  'Schneider', 'Mullins', 'Benson', 'Sharp', 'Bowen', 'Daniel', 'Barber', 'Cummings',
  'Hines', 'Baldwin', 'Griffith', 'Valdez', 'Hubbard', 'Salazar', 'Reeves', 'Warner',
  'Stevenson', 'Burgess', 'Santos', 'Tate', 'Cross', 'Garner', 'Mann', 'Mack',
  'Moss', 'Thornton', 'Dennis', 'Mcgee', 'Farmer', 'Delgado', 'Aguilar', 'Vega',
  'Glover', 'Manning', 'Cohen', 'Harmon', 'Rodgers', 'Robbins', 'Newton', 'Todd',
  'Blair', 'Higgins', 'Ingram', 'Reese', 'Cannon', 'Strickland', 'Townsend', 'Potter',
  'Goodwin', 'Walton', 'Rowe', 'Hampton', 'Ortega', 'Patton', 'Swanson', 'Joseph',
  'Francis', 'Goodman', 'Maldonado', 'Yates', 'Becker', 'Erickson', 'Hodges', 'Rios',
  'Conner', 'Adkins', 'Webster', 'Norman', 'Malone', 'Hammond', 'Flowers', 'Cobb',
  'Moody', 'Quinn', 'Blake', 'Maxwell', 'Pope', 'Floyd', 'Osborne', 'Paul',
  'Mccarthy', 'Guerrero', 'Lindsey', 'Estrada', 'Sandoval', 'Gibbs', 'Tyler', 'Gross',
  'Fitzgerald', 'Stokes', 'Doyle', 'Sherman', 'Saunders', 'Wise', 'Colon', 'Gill',
  'Alvarado', 'Greer', 'Padilla', 'Simon', 'Waters', 'Nunez', 'Ballard', 'Schwartz',
  'Mcbride', 'Houston', 'Christensen', 'Klein', 'Pratt', 'Briggs', 'Parsons', 'Mclaughlin',
  'Zimmerman', 'French', 'Buchanan', 'Moran', 'Copeland', 'Roy', 'Pittman', 'Brady',
  'Mccormick', 'Holloway', 'Brock', 'Poole', 'Frank', 'Logan', 'Owen', 'Bass',
  'Marsh', 'Drake', 'Wong', 'Jefferson', 'Park', 'Morton', 'Abbott', 'Sparks',
  'Patrick', 'Norton', 'Huff', 'Clayton', 'Massey', 'Lloyd', 'Figueroa', 'Carson',
  'Bowers', 'Roberson', 'Barton', 'Tran', 'Lamb', 'Harrington', 'Casey', 'Boone',
  'Cortez', 'Clarke', 'Mathis', 'Singleton', 'Wilkins', 'Cain', 'Bryan', 'Underwood',
  'Hogan', 'Mckenzie', 'Collier', 'Luna', 'Phelps', 'Mcguire', 'Allison', 'Bridges',
  'Wilkerson', 'Nash', 'Summers', 'Atkins'
];

const mockCompanies = [
  'Global Insurance Inc.', 'Secure Life Assurance', 'Premier Risk Solutions',
  'Guardian Insurance Group', 'Apex Coverage Partners', 'Elite Insurance Services',
  'Pinnacle Protection Co.', 'Reliable Insurance Associates', 'Strategic Risk Management',
  'Comprehensive Coverage Corp.', 'Prestige Insurance Alliance', 'Sentinel Insurance Group',
  'Advantage Assurance Ltd.', 'Cornerstone Insurance Partners', 'Paramount Protection Services',
  'Integrity Insurance Solutions', 'Liberty Coverage Group', 'Horizon Insurance Specialists',
  'Vanguard Risk Advisors', 'Alliance Insurance Consultants', 'Pacific Insurance Holdings',
  'Meridian Coverage Solutions', 'Sapphire Insurance Services', 'Everest Protection Group',
  'Monarch Insurance Partners', 'Olympus Risk Management', 'Titan Insurance Associates',
  'Zenith Coverage Solutions', 'Aegis Insurance Group', 'Citadel Protection Services',
  'Dynasty Insurance Partners', 'Frontier Risk Solutions', 'Heritage Insurance Advisors',
  'Imperial Coverage Group', 'Jubilee Insurance Services', 'Kingdom Protection Partners',
  'Legacy Insurance Associates', 'Majestic Risk Management', 'Noble Insurance Solutions',
  'Oasis Coverage Consultants', 'Phoenix Insurance Group', 'Quantum Risk Advisors',
  'Regent Insurance Partners', 'Sovereign Protection Services', 'Triumph Insurance Solutions',
  'Unity Coverage Group', 'Valor Insurance Associates', 'Wisdom Risk Management',
  'Xcellence Insurance Partners', 'Yellowstone Coverage Solutions', 'Zephyr Insurance Group'
];

const mockTitles = [
  'Chief Risk Officer', 'VP of Insurance Operations', 'Director of Underwriting',
  'Head of Claims', 'Insurance Operations Manager', 'Senior Underwriter',
  'Risk Management Director', 'Claims Processing Manager', 'Insurance Sales Director',
  'Policy Administration Manager', 'Compliance Officer', 'Actuarial Services Director',
  'Insurance Product Manager', 'Client Relations Director', 'Reinsurance Manager',
  'Loss Control Specialist', 'Insurance Marketing Director', 'Benefits Coordinator',
  'Insurance Agency Owner', 'Risk Analyst Manager', 'Insurance Broker',
  'Claims Adjuster Supervisor', 'Insurance Account Executive', 'Underwriting Supervisor',
  'Insurance Sales Manager', 'Policy Services Director', 'Risk Assessment Specialist',
  'Insurance Operations Director', 'Claims Investigation Manager', 'Insurance Strategy Director',
  'Chief Underwriting Officer', 'VP of Claims', 'Director of Risk Management',
  'Head of Insurance Sales', 'Policy Administration Director', 'Senior Claims Adjuster',
  'Risk Compliance Manager', 'Insurance Product Director', 'Client Services Manager',
  'Reinsurance Specialist', 'Loss Prevention Director', 'Insurance Marketing Manager',
  'Benefits Administration Manager', 'Agency Relations Director', 'Risk Control Manager',
  'Insurance Development Director', 'Claims Processing Supervisor', 'Account Management Director',
  'Underwriting Operations Manager', 'Insurance Regional Manager'
];

const mockLocations = [
  'New York, USA', 'London, UK', 'Tokyo, Japan', 'Singapore', 'Sydney, Australia',
  'Hong Kong', 'Toronto, Canada', 'Paris, France', 'Berlin, Germany', 'Mumbai, India',
  'Shanghai, China', 'São Paulo, Brazil', 'Dubai, UAE', 'Amsterdam, Netherlands',
  'Madrid, Spain', 'Seoul, South Korea', 'Zurich, Switzerland', 'Stockholm, Sweden',
  'Mexico City, Mexico', 'Johannesburg, South Africa', 'Milan, Italy', 'Bangkok, Thailand',
  'Vienna, Austria', 'Brussels, Belgium', 'Oslo, Norway', 'Warsaw, Poland',
  'Dublin, Ireland', 'Helsinki, Finland', 'Copenhagen, Denmark', 'Prague, Czech Republic',
  'Budapest, Hungary', 'Athens, Greece', 'Lisbon, Portugal', 'Manila, Philippines',
  'Kuala Lumpur, Malaysia', 'Jakarta, Indonesia', 'Taipei, Taiwan', 'Riyadh, Saudi Arabia',
  'Istanbul, Turkey', 'Cairo, Egypt', 'Auckland, New Zealand', 'Santiago, Chile',
  'Bogotá, Colombia', 'Lima, Peru', 'Buenos Aires, Argentina', 'Caracas, Venezuela',
  'Panama City, Panama', 'San José, Costa Rica', 'Nairobi, Kenya', 'Lagos, Nigeria'
];

/**
 * Generate a random lead
 * @param region Optional region to filter by
 * @param industry Optional industry to filter by
 * @returns A randomly generated lead
 */
const generateRandomLead = (region?: string, industry: string = 'Insurance'): Lead => {
  const firstName = mockFirstNames[Math.floor(Math.random() * mockFirstNames.length)];
  const lastName = mockLastNames[Math.floor(Math.random() * mockLastNames.length)];
  const name = `${firstName} ${lastName}`;
  const title = mockTitles[Math.floor(Math.random() * mockTitles.length)];
  const company = mockCompanies[Math.floor(Math.random() * mockCompanies.length)];
  const location = region ? 
    mockLocations.find(loc => loc.includes(region)) || mockLocations[Math.floor(Math.random() * mockLocations.length)] :
    mockLocations[Math.floor(Math.random() * mockLocations.length)];
  
  // Generate a business email based on name and company
  const companyDomain = company.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${companyDomain}`;
  
  // Generate a LinkedIn URL
  const linkedinUrl = `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.floor(Math.random() * 10000)}`;
  
  // Determine if the person is a decision maker based on their title
  const isDecisionMaker = 
    title.includes('Chief') || 
    title.includes('VP') || 
    title.includes('Director') || 
    title.includes('Head') || 
    title.includes('Manager');
  
  // Generate a confidence score
  const confidenceScore = isDecisionMaker ? 
    0.7 + (Math.random() * 0.3) : // 0.7 - 1.0 for decision makers
    0.3 + (Math.random() * 0.4);  // 0.3 - 0.7 for non-decision makers
  
  return {
    id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name,
    title,
    company,
    location,
    email,
    linkedinUrl,
    industry,
    confidenceScore,
    isDecisionMaker,
    status: 'new',
    createdAt: new Date().toISOString(),
  };
};

/**
 * Simulate scraping leads from a source
 * @param options The scraping options
 * @returns A promise that resolves to an array of leads
 */
export const scrapeLeads = async (options: ScrapingOptions): Promise<Lead[]> => {
  try {
    console.log(`Scraping leads from ${options.source} for ${options.region} in ${options.industry} industry`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate random leads
    const numLeads = options.maxResults || Math.floor(Math.random() * 10) + 5; // 5-15 leads
    const leads: Lead[] = [];
    
    for (let i = 0; i < numLeads; i++) {
      const lead = generateRandomLead(options.region, options.industry);
      leads.push(lead);
      
      // Simulate a delay between generating leads
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log(`Scraped ${leads.length} leads`);
    return leads;
  } catch (error) {
    console.error('Error scraping leads:', error);
    throw error;
  }
};

/**
 * Evaluate leads using AI
 * @param leads The leads to evaluate
 * @returns A promise that resolves to an array of evaluated leads
 */
export const evaluateLeads = async (leads: Lead[]): Promise<Lead[]> => {
  try {
    console.log(`Evaluating ${leads.length} leads`);
    
    const evaluatedLeads: Lead[] = [];
    
    for (const lead of leads) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        // In a real implementation, we would use the OpenAI API to evaluate the lead
        // For the MVP, we'll use a simplified evaluation based on the title
        const evaluation = await evaluateLead({
          name: lead.name,
          title: lead.title,
          company: lead.company,
          industry: lead.industry,
        });
        
        const evaluatedLead: Lead = {
          ...lead,
          confidenceScore: evaluation.confidenceScore,
          isDecisionMaker: evaluation.isDecisionMaker,
          status: evaluation.confidenceScore > 0.7 ? 'qualified' : 'new',
        };
        
        evaluatedLeads.push(evaluatedLead);
      } catch (error) {
        console.error(`Error evaluating lead ${lead.id}:`, error);
        // If evaluation fails, just add the original lead
        evaluatedLeads.push(lead);
      }
    }
    
    console.log(`Evaluated ${evaluatedLeads.length} leads`);
    return evaluatedLeads;
  } catch (error) {
    console.error('Error evaluating leads:', error);
    throw error;
  }
};