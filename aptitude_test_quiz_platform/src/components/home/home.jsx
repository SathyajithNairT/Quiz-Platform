import { Quiz } from '../quiz/quiz'


export function Home() {
    return (
        <div className='home-main-wrap'>
            <main className="main-content">
                <section className="hero">
                    <h1>Aptitude Test Quiz Platform by <span style={{color: 'rgb(210, 12, 12)'}}>SnDev</span></h1>
                    <p>Prepare for your exams with our comprehensive quizzes.</p>
                </section>
                {/* <Quiz /> */}
            </main>
        </div>
    )
}