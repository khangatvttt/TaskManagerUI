import React, { useState, useEffect } from 'react';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem
} from 'mdb-react-ui-kit';
import { useParams } from 'react-router-dom';
import Header from './Header';
import taskService from './service/taskService';
import Moment from 'moment';
import CountDownTimer from './CountDownTimer';
import StatusBadge from './StatusBadge';




const DetailPage = () => {
  const { userId, taskId } = useParams()
  const [task, setTask] = useState(null)

  function timeLeft(timeStart,timeEnd) {
    const start = new Date(timeStart)
    const end = new Date(timeEnd)
    const now = new Date()

    const totalTime = end - start
    const timeLeft = end - now

    const result = ((totalTime - timeLeft) / totalTime) * 100;
    if (result<0){
      return 100
    }
    return result
  }

  useEffect(() => {
    const fetchData = async () => {
        taskService.getTaskAssignment(taskId, userId)
        .then(res =>{
            console.log(res)
            setTask(res.data)
        })
        .catch(e=>{
            console.log(e)
            console.log(e.response.data)
            setError(e.response.data.error);
        })

    };

    fetchData();
  }, []);

  if (!task) {
    return <div>Loading...</div>; // or some loading spinner
  }

    return (
      <div>
      <Header/>

      <section style={{ backgroundColor: '#eee' }}>
        <MDBContainer className="py-5">

          <MDBRow>
  
            <MDBCol lg="12">
              <MDBCard className="mb-4">
                <MDBCardBody>
                <MDBCardText className="mb-4"><b>General Task Infomation</b></MDBCardText>
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Task name</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{task.taskName}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Description</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{task.description}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Create at</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{Moment(task.createAt).format('HH:mm DD-MM-yyyy')}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Due at</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{Moment(task.dueAt).format('HH:mm DD-MM-yyyy')}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Task owner</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{task.taskOwner}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Number of participants</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{task.teamSize}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>

              <MDBRow>
                <MDBCol md="12">
                  <MDBCard className="mb-4 mb-md-0">
                    <MDBCardBody>
                      <MDBCardText className="mb-2"><b>Personal Task Status</b></MDBCardText>
                      <MDBCardText className="mt-2 mb-2" style={{ fontSize: '.88rem' }}><i>Your task: {task.subTask}</i></MDBCardText>
                      <MDBCardText className="mt-2 mb-2" style={{ fontSize: '.88rem' }}><i>Assigned at: {Moment(task.assignedAt).format('HH:mm DD-MM-yyyy')}</i></MDBCardText>
                      <StatusBadge status={task.personalStatus}/>
                      <MDBCardText className="mt-2 mb-1" style={{ fontSize: '.77rem' }}>Progresstion ({task.progression}%)</MDBCardText>
                      <MDBProgress className="rounded">
                        <MDBProgressBar width={task.progression} valuemin={0} valuemax={100} />
                      </MDBProgress>

                      <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Priority (Level {task.priority})</MDBCardText>
                      <MDBProgress className="rounded">
                        <MDBProgressBar width={task.priority*10} valuemin={0} valuemax={100} />
                      </MDBProgress>

                      <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Time ({ <CountDownTimer targetDate={task.dueAt} />})</MDBCardText>
                      <MDBProgress className="rounded">
                        <MDBProgressBar width={timeLeft(task.assignedAt,task.dueAt)} valuemin={0} valuemax={100} />
                      </MDBProgress>

                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>

              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
      </div>
    );
}

export default DetailPage