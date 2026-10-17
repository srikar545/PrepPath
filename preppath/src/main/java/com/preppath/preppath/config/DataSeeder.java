package com.preppath.preppath.config;

import com.preppath.preppath.entity.Difficulty;
import com.preppath.preppath.entity.Question;
import com.preppath.preppath.entity.Topic;
import com.preppath.preppath.repository.QuestionRepository;
import com.preppath.preppath.repository.TopicRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Seeds 25 original public-domain APPSC Group 2 style questions
 * across 5 topics on application startup.
 *
 * Idempotent: skips entirely if any questions already exist.
 * Topics are matched by name to avoid creating duplicates.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final TopicRepository topicRepository;
    private final QuestionRepository questionRepository;

    public DataSeeder(TopicRepository topicRepository,
                      QuestionRepository questionRepository) {
        this.topicRepository = topicRepository;
        this.questionRepository = questionRepository;
    }

    @Override
    public void run(String... args) {
        if (questionRepository.count() > 0) {
            return; // already seeded — skip
        }
        seed();
    }

    private void seed() {
        Topic polity  = findOrCreate("Indian Polity",
                "Constitutional framework, fundamental rights, and governance of India.");
        Topic history = findOrCreate("Indian History",
                "Freedom struggle, Mughal era, and modern India.");
        Topic geo     = findOrCreate("Indian Geography",
                "Physical features, rivers, climate, and states of India.");
        Topic science = findOrCreate("General Science",
                "Basic physics, chemistry, and biology for competitive exams.");
        Topic economy = findOrCreate("Indian Economy",
                "Planning, banking, taxation, and economic policy of India.");

        List<Question> questions = new ArrayList<>();

        // ── Indian Polity (5) ──────────────────────────────────────────────
        questions.add(q(polity,
                "Which article of the Indian Constitution guarantees the Right to Freedom of Speech and Expression?",
                "Article 19", "Article 21", "Article 14", "Article 32",
                "A", Difficulty.EASY,
                "Article 19(1)(a) guarantees freedom of speech and expression. It can be restricted on grounds listed in Article 19(2) such as sovereignty, public order, and decency."));

        questions.add(q(polity,
                "Which Part of the Indian Constitution contains the Fundamental Rights?",
                "Part II", "Part III", "Part IV", "Part V",
                "B", Difficulty.EASY,
                "Part III (Articles 12–35) contains the six Fundamental Rights: Right to Equality, Freedom, Against Exploitation, Freedom of Religion, Cultural & Educational Rights, and Constitutional Remedies."));

        questions.add(q(polity,
                "In which year were the words 'Socialist' and 'Secular' added to the Preamble of the Indian Constitution?",
                "1950", "1966", "1976", "1985",
                "C", Difficulty.MEDIUM,
                "The 42nd Constitutional Amendment Act of 1976 inserted the words 'Socialist', 'Secular', and 'Integrity' into the Preamble during the Emergency period."));

        questions.add(q(polity,
                "Under which Article of the Constitution can the President of India proclaim a National Emergency?",
                "Article 360", "Article 356", "Article 370", "Article 352",
                "D", Difficulty.MEDIUM,
                "Article 352 empowers the President to proclaim a National Emergency if the security of India or any part of it is threatened by war, external aggression, or armed rebellion."));

        questions.add(q(polity,
                "The Directive Principles of State Policy are enshrined in which Part of the Indian Constitution?",
                "Part III", "Part V", "Part II", "Part IV",
                "D", Difficulty.EASY,
                "Part IV (Articles 36–51) contains the Directive Principles of State Policy. They are non-justiciable but fundamental to governance and are inspired by the Irish Constitution."));

        // ── Indian History (5) ─────────────────────────────────────────────
        questions.add(q(history,
                "In which year was the Indian National Congress founded?",
                "1857", "1905", "1885", "1920",
                "C", Difficulty.EASY,
                "The Indian National Congress was founded in 1885 by Allan Octavian Hume, Dadabhai Naoroji, and Dinshaw Wacha. Its first session was held in Bombay (now Mumbai)."));

        questions.add(q(history,
                "The Dandi March of 1930 was a protest led by Mahatma Gandhi against which British law?",
                "Rowlatt Act", "Salt Laws", "Arms Act", "Vernacular Press Act",
                "B", Difficulty.EASY,
                "Gandhi marched from Sabarmati Ashram to Dandi (240 miles) between March 12 and April 6, 1930, to protest the British monopoly on salt production and the heavy salt tax."));

        questions.add(q(history,
                "Who gave the historic call 'Do or Die' at the launch of the Quit India Movement in 1942?",
                "Jawaharlal Nehru", "Subhas Chandra Bose", "Bal Gangadhar Tilak", "Mahatma Gandhi",
                "D", Difficulty.EASY,
                "Mahatma Gandhi gave the 'Do or Die' slogan on August 8, 1942, at the Gowalia Tank Maidan in Bombay at the All India Congress Committee session that launched Quit India."));

        questions.add(q(history,
                "The first partition of Bengal (1905) was annulled in which year?",
                "1911", "1919", "1920", "1909",
                "A", Difficulty.MEDIUM,
                "The partition of Bengal by Lord Curzon in 1905 was reversed in 1911 by King George V at the Delhi Durbar, largely due to mass protests and the Swadeshi Movement it triggered."));

        questions.add(q(history,
                "At which session of the Indian National Congress was the resolution for 'Poorna Swaraj' (complete independence) adopted?",
                "Nagpur 1920", "Calcutta 1928", "Lahore 1929", "Karachi 1931",
                "C", Difficulty.HARD,
                "The Lahore session (December 1929), presided over by Jawaharlal Nehru, passed the Poorna Swaraj resolution. January 26, 1930 was declared India's Independence Day, celebrated annually until actual independence in 1947."));

        // ── Indian Geography (5) ───────────────────────────────────────────
        questions.add(q(geo,
                "Through how many Indian states does the Tropic of Cancer pass?",
                "6", "5", "9", "8",
                "D", Difficulty.MEDIUM,
                "The Tropic of Cancer passes through 8 states: Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal, Tripura, and Mizoram."));

        questions.add(q(geo,
                "Which river was historically called the 'Sorrow of Bengal' due to its devastating floods?",
                "Hooghly", "Teesta", "Mahanadi", "Damodar",
                "D", Difficulty.EASY,
                "The Damodar River was called the 'Sorrow of Bengal' before the Damodar Valley Corporation (DVC) was established in 1948 to control floods and generate hydro-electric power."));

        questions.add(q(geo,
                "Which is the largest river basin in India by area?",
                "Godavari", "Ganga", "Brahmaputra", "Indus",
                "B", Difficulty.EASY,
                "The Ganga basin is India's largest river basin, covering approximately 8.6 lakh sq km — about 26% of India's total geographical area — and is home to the most densely populated part of the country."));

        questions.add(q(geo,
                "The Brahmaputra River enters India from which country?",
                "Nepal", "Bhutan", "Myanmar", "China",
                "D", Difficulty.MEDIUM,
                "The Brahmaputra originates in the Tibetan Plateau (China) as the Tsangpo, enters India through Arunachal Pradesh, flows through Assam, and then into Bangladesh where it joins the Ganga."));

        questions.add(q(geo,
                "Which of the following states does NOT share a land border with Andhra Pradesh?",
                "Tamil Nadu", "Karnataka", "Goa", "Odisha",
                "C", Difficulty.MEDIUM,
                "Andhra Pradesh shares borders with Telangana, Chhattisgarh, Odisha, Tamil Nadu, Karnataka, and Maharashtra. Goa does not border Andhra Pradesh."));

        // ── General Science (5) ────────────────────────────────────────────
        questions.add(q(science,
                "In which cell organelle does the process of photosynthesis take place?",
                "Mitochondria", "Ribosome", "Chloroplast", "Nucleus",
                "C", Difficulty.EASY,
                "Chloroplasts contain the green pigment chlorophyll and are the site of photosynthesis. The light-dependent reactions occur in the thylakoids and the Calvin cycle occurs in the stroma."));

        questions.add(q(science,
                "What is the SI unit of electrical resistance?",
                "Ampere", "Ohm", "Volt", "Watt",
                "B", Difficulty.EASY,
                "The ohm (symbol: Ω) is the SI unit of electrical resistance, named after German physicist Georg Simon Ohm. By Ohm's Law, R = V/I (resistance equals voltage divided by current)."));

        questions.add(q(science,
                "Which gas is released as a byproduct when plants carry out photosynthesis?",
                "Carbon dioxide", "Nitrogen", "Hydrogen", "Oxygen",
                "D", Difficulty.EASY,
                "Plants absorb carbon dioxide and water and, using sunlight energy, produce glucose and oxygen. The oxygen (O₂) is released through stomata as a byproduct of the light-dependent reactions."));

        questions.add(q(science,
                "What is the chemical formula of common salt (sodium chloride)?",
                "Na₂CO₃", "NaHCO₃", "NaOH", "NaCl",
                "D", Difficulty.EASY,
                "Common salt is sodium chloride (NaCl), formed by the ionic bond between sodium (Na⁺) and chloride (Cl⁻) ions. Na₂CO₃ is washing soda, NaHCO₃ is baking soda, and NaOH is caustic soda."));

        questions.add(q(science,
                "Which vitamin is synthesised in the human body when skin is exposed to sunlight?",
                "Vitamin D", "Vitamin C", "Vitamin A", "Vitamin B12",
                "A", Difficulty.EASY,
                "UVB radiation from sunlight converts 7-dehydrocholesterol in the skin to vitamin D3 (cholecalciferol). Vitamin D is essential for calcium absorption and bone health."));

        // ── Indian Economy (5) ─────────────────────────────────────────────
        questions.add(q(economy,
                "In which year was the Reserve Bank of India (RBI) established?",
                "1947", "1949", "1935", "1950",
                "C", Difficulty.EASY,
                "The RBI was established on April 1, 1935, under the Reserve Bank of India Act, 1934. It was nationalised in 1949 and serves as India's central bank and monetary authority."));

        questions.add(q(economy,
                "On which date was the Goods and Services Tax (GST) implemented across India?",
                "1 April 2016", "1 July 2016", "1 January 2018", "1 July 2017",
                "D", Difficulty.EASY,
                "GST was launched at midnight on July 1, 2017, replacing a complex web of central and state indirect taxes (excise duty, service tax, VAT, etc.) with a unified destination-based tax."));

        questions.add(q(economy,
                "In which year was NITI Aayog established, replacing the Planning Commission?",
                "2016", "2014", "2013", "2015",
                "D", Difficulty.MEDIUM,
                "NITI (National Institution for Transforming India) Aayog was established on January 1, 2015, by a Cabinet resolution. Unlike the Planning Commission, it has no power to allocate funds to states."));

        questions.add(q(economy,
                "India's Green Revolution primarily led to a dramatic increase in the production of which crop?",
                "Rice", "Cotton", "Wheat", "Sugarcane",
                "C", Difficulty.EASY,
                "The Green Revolution of the 1960s–70s, driven by high-yielding variety (HYV) seeds developed by M.S. Swaminathan and others, dramatically boosted wheat production, especially in Punjab and Haryana."));

        questions.add(q(economy,
                "'Inclusive Growth' was the central theme of which Five Year Plan of India?",
                "Ninth (1997–2002)", "Tenth (2002–2007)", "Twelfth (2012–2017)", "Eleventh (2007–2012)",
                "D", Difficulty.MEDIUM,
                "The Eleventh Five Year Plan (2007–2012), chaired by Montek Singh Ahluwalia, adopted 'Inclusive Growth' as its theme, targeting faster growth alongside reduced inequality and improved access to basic services."));

        questionRepository.saveAll(questions);
        System.out.printf("[DataSeeder] Seeded %d questions across 5 topics.%n", questions.size());
    }

    /**
     * Returns the topic with the given name if it already exists in the database,
     * or creates and saves a new one. Prevents duplicate topic records on re-seed.
     */
    private Topic findOrCreate(String name, String description) {
        return topicRepository.findByName(name).orElseGet(() -> {
            Topic t = new Topic();
            t.setName(name);
            t.setDescription(description);
            return topicRepository.save(t);
        });
    }

    /** Helper to build a Question without repetitive boilerplate. */
    private Question q(Topic topic,
                       String text,
                       String a, String b, String c, String d,
                       String correct,
                       Difficulty difficulty,
                       String explanation) {
        Question question = new Question();
        question.setTopic(topic);
        question.setText(text);
        question.setOptionA(a);
        question.setOptionB(b);
        question.setOptionC(c);
        question.setOptionD(d);
        question.setCorrectOption(correct);
        question.setDifficulty(difficulty);
        question.setExplanation(explanation);
        return question;
    }
}
